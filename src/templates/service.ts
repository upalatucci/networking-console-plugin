import { ServiceModel } from '@kubevirt-ui/kubevirt-api/console';

export const ServiceYAMLTemplates = `
apiVersion: ${ServiceModel.apiGroup}/${ServiceModel.apiVersion}
kind: ${ServiceModel.kind}
metadata:
  name: exampleasd
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376

`;
