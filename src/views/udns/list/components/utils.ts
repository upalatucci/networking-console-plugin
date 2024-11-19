export const createUDN = (name: string, namespace: string, subnet: string) => ({
  apiVersion: 'k8s.ovn.org/v1',
  kind: 'UserDefinedNetwork',
  metadata: {
    name,
    namespace,
  },
  spec: {
    layer2: {
      ipamLifecycle: 'Persistent',
      role: 'Primary',
      subnets: [subnet],
    },
    topology: 'Layer2',
  },
});
