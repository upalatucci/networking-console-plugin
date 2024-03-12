/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import * as _ from 'lodash';

import { NamespaceModel, PodModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiCoreV1Pod } from '@kubevirt-ui/kubevirt-api/kubernetes/models/IoK8sApiCoreV1Pod';
import {
  K8sModel,
  K8sResourceCommon,
  ResourceIcon,
  Selector,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Alert, Label, Popover, TreeView, TreeViewDataItem } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { selectorToK8s } from '@utils/models';
import { resourcePathFromModel } from '@utils/utils';

enum FilterType {
  LABEL = 'Label',
  NAME = 'Name',
}

export const filterTypeMap = Object.freeze({
  [FilterType.LABEL]: 'labels',
  [FilterType.NAME]: 'name',
});

export const resourceListPathFromModel = (model: K8sModel, namespace?: string) =>
  resourcePathFromModel(model, null, namespace);

const maxPreviewPods = 10;
const labelFilterQueryParamSeparator = ',';

type NetworkPolicySelectorPreviewProps = {
  dataTest?: string;
  namespaceSelector?: string[][];
  podSelector: string[][];
  policyNamespace: string;
  popoverRef: React.MutableRefObject<undefined>;
};

export const NetworkPolicySelectorPreview: React.FC<NetworkPolicySelectorPreviewProps> = (
  props,
) => {
  const allNamespaces =
    props.namespaceSelector && props.namespaceSelector.filter((pair) => !!pair[0]).length === 0;

  return (
    <Popover
      aria-label="pods-list"
      bodyContent={
        // eslint-disable-next-line no-nested-ternary
        props.namespaceSelector ? (
          allNamespaces ? (
            <PodsPreview podSelector={props.podSelector} />
          ) : (
            <PodsPreview
              namespaceSelector={props.namespaceSelector}
              podSelector={props.podSelector}
            />
          )
        ) : (
          <PodsPreview namespace={props.policyNamespace} podSelector={props.podSelector} />
        )
      }
      data-test={props.dataTest ? `${props.dataTest}-popover` : `pods-preview-popover`}
      position={'bottom'}
      triggerRef={props.popoverRef}
    />
  );
};

// Prevents illegal selectors to crash the system when passed to useK8sWatchResource
const allowedSelector = /^([A-Za-z0-9][-A-Za-z0-9_\\/.]*)?[A-Za-z0-9]$/;
const safeSelector = (selector?: string[][]): [Selector, string?] => {
  if (!selector || selector?.length === 0) {
    return [{ matchLabels: {} }, undefined];
  }
  for (const label of selector) {
    if (!label[0].match(allowedSelector)) {
      return [{ matchLabels: {} }, label[0]];
    }
    if (!label[1].match(allowedSelector)) {
      return [{ matchLabels: {} }, label[1]];
    }
  }
  return [selectorToK8s(selector) as Selector, undefined];
};

function useWatch<T>(kind: string, selector: Selector, namespace?: string) {
  const watchPods = React.useMemo(
    () => ({
      isList: true,
      kind,
      namespace,
      selector,
    }),
    [kind, namespace, selector],
  );
  return useK8sWatchResource<T[]>(watchPods);
}

/**
 * `podSelector` must be set (even if empty).
 *
 * If `namespace` is set, it will look for pods within this namespace, otherwise:
 *    - if `namespaceSelector` is not set or empty, if will look for pods in all the namespaces
 *    - if `namespaceSelector` is set, it will look for pods in the namespaces with labels matching this selector
 */
type PodsPreviewProps = {
  namespace?: string;
  namespaceSelector?: string[][];
  podSelector: string[][];
};

/**
 * Instantiates a pods preview tree
 * @param props see {@link PodsPreviewProps}
 * @returns a pods preview tree
 */
export const PodsPreview: React.FunctionComponent<PodsPreviewProps> = (props) => {
  const { namespace, namespaceSelector, podSelector } = props;
  const { t } = useNetworkingTranslation();

  const [safeNsSelector, offendingNsSelector] = React.useMemo(
    () => safeSelector(namespaceSelector),
    [namespaceSelector],
  );

  const [safePodSelector, offendingPodSelector] = React.useMemo(
    () => safeSelector(podSelector),
    [podSelector],
  );

  const [watchedPods, watchPodLoaded, watchPodError] = useWatch<IoK8sApiCoreV1Pod>(
    PodModel.kind,
    safePodSelector,
    namespace,
  );

  const [watchedNs, watchNsLoaded, watchNsError] = useWatch<K8sResourceCommon>(
    NamespaceModel.kind,
    safeNsSelector,
  );

  const selectorError = React.useMemo(() => {
    if (offendingPodSelector || offendingNsSelector) {
      return t(
        'Input error: selectors must start and end by a letter ' +
          'or number, and can only contain -, _, / or . ' +
          'Offending value: {{offendingSelector}}',
        {
          offendingSelector: offendingPodSelector || offendingNsSelector,
        },
      );
    }
    return undefined;
  }, [offendingPodSelector, offendingNsSelector, t]);

  // Converts fetched namespaces to a set for faster lookup
  const matchedNs = React.useMemo(() => {
    const set = new Set<string>();
    if (watchNsLoaded && !watchNsError) {
      for (const ns of watchedNs) {
        const name = ns.metadata?.name;
        if (name) {
          set.add(name);
        }
      }
    }
    return set;
  }, [watchNsError, watchNsLoaded, watchedNs]);

  // takes the first 'maxPreviewPods' received pods and groups them by namespace
  const preview: {
    error?: any;
    pods?: TreeViewDataItem[];
    total?: number;
  } = React.useMemo(() => {
    if (selectorError) {
      return { error: selectorError };
    }
    if (watchPodError) {
      return { error: watchPodError };
    }
    if (!watchPodLoaded) {
      return { pods: [], total: 0 };
    }
    // If there is a defined namespace selector, filter pods to remove
    // those from non-matching namespaces
    let filteredPods = watchedPods;
    if (namespaceSelector) {
      if (watchNsError) {
        return { error: watchNsError };
      }
      filteredPods = filteredPods.filter(
        (pod) => pod.metadata.namespace && matchedNs.has(pod.metadata.namespace),
      );
    }
    // Group pod TreeViewDataItem by namespace, up to a maximum of maxPreviewedPods entries
    const podsByNs: { [key: string]: TreeViewDataItem[] } = {};
    filteredPods.slice(0, maxPreviewPods).forEach((pod) => {
      const ns = pod?.metadata?.namespace as string;
      podsByNs[ns] = podsByNs[ns] || [];
      podsByNs[ns].push({
        icon: <ResourceIcon kind={PodModel.kind} />,
        name: pod?.metadata?.name,
      });
    });
    // Then convert the above groups of pod TreeViewDataItems to subchildren of
    // the namespaces' TreeViewDataItems
    const podTreeEntries = _.toPairs(podsByNs).map(
      ([ns, pods]): TreeViewDataItem => ({
        children: pods,
        defaultExpanded: true,
        icon: <ResourceIcon kind={NamespaceModel.kind} />,
        name: ns,
      }),
    );
    return {
      pods: podTreeEntries,
      total: filteredPods.length,
    };
  }, [
    matchedNs,
    namespaceSelector,
    selectorError,
    watchNsError,
    watchPodError,
    watchPodLoaded,
    watchedPods,
  ]);

  const labelList = _.map(safePodSelector.matchLabels || {}, (value, label) => `${label}=${value}`);
  const labelBadges = _.map(safePodSelector.matchLabels || {}, (value, label) => (
    <Label color="green" key={label} value={value}>
      {label}={value}
    </Label>
  ));
  // Filter by labels in the "View all XXX results" link, if needed
  const podsFilterQuery =
    preview.total && preview.total > maxPreviewPods && labelList.length > 0
      ? `?${filterTypeMap.Label}=${encodeURIComponent(
          labelList.join(labelFilterQueryParamSeparator),
        )}`
      : '';

  return preview.error ? (
    <Alert data-test="pods-preview-alert" isInline title={t("Can't preview pods")} variant="danger">
      <p>{String(preview.error)}</p>
    </Alert>
  ) : (
    <>
      {watchPodLoaded && preview.pods?.length === 0 && (
        <div data-test="pods-preview-title">
          {t('No pods matching the provided labels in the current namespace')}
        </div>
      )}
      {preview.pods && preview.pods.length > 0 && (
        <>
          <div data-test="pods-preview-title">
            {labelList?.length > 0 ? (
              <>
                {t('List of pods matching')} {labelBadges}
              </>
            ) : (
              t('List of pods')
            )}
          </div>
          <TreeView
            className="co-create-networkpolicy__selector-preview"
            data={preview.pods}
            data-test="pods-preview-tree"
            hasGuides
          />
          {preview.total && preview.total > maxPreviewPods && (
            <>
              {_.size(safeNsSelector.matchLabels) === 0 ? (
                <a
                  data-test="pods-preview-footer-link"
                  href={`${resourceListPathFromModel(PodModel, namespace)}${podsFilterQuery}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t('View all {{total}} results', {
                    total: preview.total,
                  })}
                </a>
              ) : (
                // The PodsList page allows filtering by pod labels for the current namespace
                // or for all the namespaces, but does not allow filtering by namespace labels.
                // So if the namespace selector has labels, we disable the link to avoid
                // directing the user to incorrect data
                <p data-test="pods-preview-footer">
                  {t('Showing {{shown}} from {{total}} results', {
                    shown: maxPreviewPods,
                    total: preview.total,
                  })}
                </p>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
