import {
  K8sModel,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';

export const getDefinitionKey = _.memoize(
  (model: K8sModel, definitions: SwaggerDefinitions): string => {
    return _.findKey(definitions, (def: SwaggerDefinition) => {
      return _.some(
        def['x-kubernetes-group-version-kind'],
        ({ group, version, kind }) => {
          return (
            (model?.apiGroup ?? '') === (group || '') &&
            model?.apiVersion === version &&
            model?.kind === kind
          );
        },
      );
    });
  },
  getGroupVersionKindForModel,
);

let swaggerDefinitions: SwaggerDefinitions;
export const getSwaggerDefinitions = (): SwaggerDefinitions =>
  swaggerDefinitions;

const getRef = (definition: SwaggerDefinition): string => {
  const ref = definition.$ref || _.get(definition, 'items.$ref');
  const re = /^#\/definitions\//;
  // Only follow JSON pointers, not external URI references.
  return ref && re.test(ref) ? ref.replace(re, '') : null;
};

// Get the path in the swagger document to additional property details.
// This can be
// - A reference to another top-level definition
// - Inline property declartions
// - Inline property declartions for array items
export const getSwaggerPath = (
  allProperties: SwaggerDefinitions,
  currentPath: string[],
  name: string,
  followRef: boolean,
): string[] => {
  const nextPath = [...currentPath, 'properties', name];
  const definition = _.get(allProperties, nextPath) as SwaggerDefinition;
  if (!definition) {
    return null;
  }
  const ref = getRef(definition);
  return followRef && ref ? [ref] : nextPath;
};

export const findDefinition = (
  kindObj: K8sModel,
  propertyPath: string[],
): SwaggerDefinition => {
  if (!swaggerDefinitions) {
    return null;
  }

  const rootPath = getDefinitionKey(kindObj, swaggerDefinitions);
  const path = propertyPath.reduce(
    (currentPath: string[], nextProperty: string, i: number): string[] => {
      if (!currentPath) {
        return null;
      }
      // Don't follow the last reference since the description is not as good.
      const followRef = i !== propertyPath.length - 1;
      return getSwaggerPath(
        swaggerDefinitions,
        currentPath,
        nextProperty,
        followRef,
      );
    },
    [rootPath],
  );

  return path ? (_.get(swaggerDefinitions, path) as SwaggerDefinition) : null;
};

export const getPropertyDescription = (
  kindObj: K8sModel,
  propertyPath: string | string[],
): string => {
  const path: string[] = _.toPath(propertyPath);
  const definition = findDefinition(kindObj, path);
  return definition ? definition.description : null;
};

export const getResourceDescription = _.memoize((kindObj: K8sModel): string => {
  if (!swaggerDefinitions) {
    return null;
  }
  const key = getDefinitionKey(kindObj, swaggerDefinitions);
  return _.get(swaggerDefinitions, [key, 'description']);
}, getGroupVersionKindForModel);

export type SwaggerDefinition = {
  definitions?: SwaggerDefinitions;
  description?: string;
  type?: string[] | string;
  enum?: string[];
  $ref?: string;
  items?: SwaggerDefinition;
  required?: string[];
  properties?: {
    [prop: string]: SwaggerDefinition;
  };
};

export type SwaggerDefinitions = {
  [name: string]: SwaggerDefinition;
};

export type SwaggerAPISpec = {
  swagger: string;
  info: { title: string; version: string };
  paths: { [path: string]: any };
  definitions: SwaggerDefinitions;
};
