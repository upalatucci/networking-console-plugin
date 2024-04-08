import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';

export const NetworkPolicyYAMLTemplates = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
name: example
namespace: default
spec:
podSelector:
  matchLabels:
    role: db
ingress:
- from:
  - namespaceSelector:
      matchLabels:
        project: myproject
  - podSelector:
      matchLabels:
        role: somerole
  ports:
  - protocol: TCP
    port: 6379
`;
