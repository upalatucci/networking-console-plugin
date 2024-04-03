import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';

export const NetworkPolicyYAMLTemplateDefault = `
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

export const NetworkPolicyYAMLTemplateDenyNamespaces = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: deny-other-namespaces
  namespace: target-ns
spec:
  podSelector:
  ingress:
  - from:
    - podSelector: {}
`;

export const NetworkPolicyYAMLTemplateAllowApp = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: db-or-api-allow-app
  namespace: target-ns
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
    - from:
      - podSelector:
          matchLabels:
            app: mail
`;

export const NetworkPolicyYAMLTemplateAPIAllowHttp = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: api-allow-http-and-https
  namespace: target-ns
spec:
  podSelector:
    matchLabels:
      app: api
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: monitoring
      ports:
        - protocol: TCP
          port: 80
        - protocol: TCP
          port: 443
`;

export const NetworkPolicyYAMLTemplateDenyAll = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: default-deny-all
  namespace: target-ns
spec:
  podSelector:
`;

export const NetworkPolicyYAMLTemplateWebAllow = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: web-allow-external
  namespace: target-ns
spec:
  podSelector:
    matchLabels:
      app: web
  ingress:
  - {}
`;

export const NetworkPolicyYAMLTemplateAllowAllNS = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: web-db-allow-all-ns
  namespace: target-ns
spec:
  podSelector:
    matchLabels:
      role: web-db
  ingress:
    - from:
      - namespaceSelector: {}
`;

export const NetworkPolicyYAMLTemplateAllowProduction = `
apiVersion: ${NetworkPolicyModel.apiGroup}/${NetworkPolicyModel.apiVersion}
kind: ${NetworkPolicyModel.kind}
metadata:
  name: web-allow-production
  namespace: target-ns
spec:
  podSelector:
    matchLabels:
      app: web
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            env: production
`;
