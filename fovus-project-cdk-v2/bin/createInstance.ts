import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from '@aws-cdk/core';


export class InstanceSingleton {
  private static instance: ec2.Instance;

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(scope: Construct): ec2.Instance {
    if (!InstanceSingleton.instance) {
      // Create a new instance if it doesn't exist
      const vpc = new ec2.Vpc(scope, 'MyVpc', { maxAzs: 2 });
      InstanceSingleton.instance = new ec2.Instance(scope, 'MyInstance', {
        vpc,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        machineImage: ec2.MachineImage.latestAmazonLinux(),
      });
    }
    return InstanceSingleton.instance;
  }
}
