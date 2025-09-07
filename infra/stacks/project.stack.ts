import { DataAwsIamPolicyDocument } from '@cdktf/provider-aws/lib/data-aws-iam-policy-document';
import { DynamodbTable } from '@cdktf/provider-aws/lib/dynamodb-table';
import { ElasticBeanstalkApplication } from '@cdktf/provider-aws/lib/elastic-beanstalk-application';
import { ElasticBeanstalkEnvironment } from '@cdktf/provider-aws/lib/elastic-beanstalk-environment';
import { IamInstanceProfile } from '@cdktf/provider-aws/lib/iam-instance-profile';
import { IamPolicy } from '@cdktf/provider-aws/lib/iam-policy';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { IamRolePolicyAttachment } from '@cdktf/provider-aws/lib/iam-role-policy-attachment';
import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { Vpc } from '@cdktf/provider-aws/lib/vpc';
import { Subnet } from '@cdktf/provider-aws/lib/subnet';
import { InternetGateway } from '@cdktf/provider-aws/lib/internet-gateway';
import { RouteTable } from '@cdktf/provider-aws/lib/route-table';
import { Route } from '@cdktf/provider-aws/lib/route';
import { RouteTableAssociation } from '@cdktf/provider-aws/lib/route-table-association';
import { SecurityGroup } from '@cdktf/provider-aws/lib/security-group';
import { DataAwsAvailabilityZones } from '@cdktf/provider-aws/lib/data-aws-availability-zones';
import { TerraformOutput, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { Fn } from 'cdktf';
import { IamUserPolicyAttachment } from '@cdktf/provider-aws/lib/iam-user-policy-attachment';
import { IamUser } from '@cdktf/provider-aws/lib/iam-user';

interface ProjectStackProps {
  environmentName: string;
  region: string;
}

export class ProjectStack extends TerraformStack {

  constructor(scope: Construct, id: string, props: ProjectStackProps) {

    super(scope, id);

    const { environmentName, region } = props;

    new AwsProvider(this, "aws", {
      region,
    });

    // Obter zonas de disponibilidade da região
    const availabilityZones = new DataAwsAvailabilityZones(this, "availability_zones", {
      state: "available",
    });

    // Criar VPC personalizada
    const vpc = new Vpc(this, "main_vpc", {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: `${environmentName}-vpc`,
        Environment: environmentName,
      },
    });

    // Criar Internet Gateway
    const internetGateway = new InternetGateway(this, "main_igw", {
      vpcId: vpc.id,
      tags: {
        Name: `${environmentName}-igw`,
        Environment: environmentName,
      },
    });

    // Criar subnets públicas em diferentes zonas de disponibilidade
    const publicSubnet1 = new Subnet(this, "public_subnet_1", {
      vpcId: vpc.id,
      cidrBlock: "10.0.1.0/24",
      availabilityZone: Fn.element(availabilityZones.names, 0),
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `${environmentName}-public-subnet-1`,
        Environment: environmentName,
        Type: "Public",
      },
    });

    const publicSubnet2 = new Subnet(this, "public_subnet_2", {
      vpcId: vpc.id,
      cidrBlock: "10.0.2.0/24",
      availabilityZone: Fn.element(availabilityZones.names, 1),
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `${environmentName}-public-subnet-2`,
        Environment: environmentName,
        Type: "Public",
      },
    });

    // Criar Route Table para subnets públicas
    const publicRouteTable = new RouteTable(this, "public_route_table", {
      vpcId: vpc.id,
      tags: {
        Name: `${environmentName}-public-rt`,
        Environment: environmentName,
      },
    });

    // Rota para Internet Gateway
    new Route(this, "public_route", {
      routeTableId: publicRouteTable.id,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: internetGateway.id,
    });

    // Associar subnets públicas com a route table
    new RouteTableAssociation(this, "public_subnet_1_association", {
      subnetId: publicSubnet1.id,
      routeTableId: publicRouteTable.id,
    });

    new RouteTableAssociation(this, "public_subnet_2_association", {
      subnetId: publicSubnet2.id,
      routeTableId: publicRouteTable.id,
    });

    // Security Group para Elastic Beanstalk
    const elasticBeanstalkSecurityGroup = new SecurityGroup(this, "elastic_beanstalk_sg", {
      name: `${environmentName}-elastic-beanstalk-sg`,
      description: "Security group for Elastic Beanstalk environment",
      vpcId: vpc.id,
      
      ingress: [
        {
          fromPort: 80,
          toPort: 80,
          protocol: "tcp",
          cidrBlocks: ["0.0.0.0/0"],
          description: "HTTP",
        },
        {
          fromPort: 443,
          toPort: 443,
          protocol: "tcp",
          cidrBlocks: ["0.0.0.0/0"],
          description: "HTTPS",
        },
        {
          fromPort: 22,
          toPort: 22,
          protocol: "tcp",
          cidrBlocks: ["10.0.0.0/16"],
          description: "SSH from VPC",
        },
      ],
      
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: "-1",
          cidrBlocks: ["0.0.0.0/0"],
          description: "All outbound traffic",
        },
      ],
      
      tags: {
        Name: `${environmentName}-elastic-beanstalk-sg`,
        Environment: environmentName,
      },
    });

    const dynamodb = new DynamodbTable(this, "users_table", {
      name: `${environmentName}-users`,
      hashKey: "id",
      attribute: [
        {
          name: "id",
          type: "S",
        },
        {
          name: "email",
          type: "S",
        },
      ],
      billingMode: "PAY_PER_REQUEST",
      globalSecondaryIndex: [
        {
          name: "email_index",
          hashKey: "email",
          projectionType: "ALL",
        },
      ],
    });

    const trustedPolicyDocument = new DataAwsIamPolicyDocument(this, "trusted_policy_document", {
      statement: [
        {
          effect: "Allow",
          actions: ["sts:AssumeRole"],
          principals: [
            {
              type: "Service",
              identifiers: ["ec2.amazonaws.com"],
            },
          ],
        },
      ],
    });

    const permissionsPolicyDocument = new DataAwsIamPolicyDocument(this, "permission_policy_document", {
      statement: [
        {
          effect: "Allow",
          actions: ["dynamodb:*"],
          resources: [`${dynamodb.arn}*`]
        },
      ],
    });

    const iamPolicy = new IamPolicy(this, "iam_policy", {
      name: `${environmentName}-application-policy`,
      policy: permissionsPolicyDocument.json,
    });

    const iamRole = new IamRole(this, "iam_role", {
      name: `${environmentName}-application-role`,
      assumeRolePolicy: trustedPolicyDocument.json,
    });

    new IamRolePolicyAttachment(this, "iam_role_policy_attachment", {
      role: iamRole.name,
      policyArn: iamPolicy.arn,
    });

    const managedPolicies = [
      'arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk',
      'arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker',
      'arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier',
      'arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier',
      'arn:aws:iam::aws:policy/AmazonEC2FullAccess',
    ];

    managedPolicies.forEach((policyArn, index) => {
      new IamRolePolicyAttachment(this, `role-policy-attachment-${index}`, {
        role: iamRole.name,
        policyArn: policyArn,
      });
    });

    const application = new ElasticBeanstalkApplication(this, "application", {
      name: `${environmentName}-api-nest-terraform-aws`,
      description: `API Restful NestJS com Terraform, AWS`,
      appversionLifecycle: {
        serviceRole: iamRole.arn,
        deleteSourceFromS3: true,
      },
    });

    const instanceProfile = new IamInstanceProfile(this, "instance-profile", {
      name: 'aws-elasticbeanstalk-ec2-role',
      role: iamRole.name,
    });

    const environment = new ElasticBeanstalkEnvironment(this, "environment", {
      tier: 'WebServer',
      name: `${environmentName}-api-nest-terraform-aws`,
      application: application.name,
      solutionStackName: '64bit Amazon Linux 2023 v6.6.4 running Node.js 20',
      setting: [
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          name: 'IamInstanceProfile',
          value: instanceProfile.name,
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          name: 'SecurityGroups',
          value: elasticBeanstalkSecurityGroup.id,
        },
        {
          namespace: 'aws:ec2:vpc',
          name: 'VPCId',
          value: vpc.id,
        },
        {
          namespace: 'aws:ec2:vpc',
          name: 'Subnets',
          value: Fn.join(",", [publicSubnet1.id, publicSubnet2.id]),
        },
        {
          namespace: 'aws:ec2:vpc',
          name: 'ELBSubnets',
          value: Fn.join(",", [publicSubnet1.id, publicSubnet2.id]),
        },
        {
          namespace: 'aws:elasticbeanstalk:cloudwatch:logs',
          name: 'StreamLogs',
          value: 'true',
        },
        {
          namespace: 'aws:elasticbeanstalk:cloudwatch:logs',
          name: 'RetentionInDays',
          value: '7',
        },
        {
          namespace: 'aws:elasticbeanstalk:cloudwatch:logs',
          name: 'DeleteOnTerminate',
          value: 'false',
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          name: 'ENVIRONMENT',
          value: environmentName,
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          name: 'NO_COLOR',
          value: 'true',
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          name: 'AWS_REGION',
          value: region,
        },
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          name: 'NODE_ENV',
          value: environmentName === 'prod' ? 'production' : 'development',
        },
      ],
      tags: {
        Environment: environmentName,
        VPC: vpc.id,
      },
    });


    new TerraformOutput(this, "environment_url", { 
      value: environment.endpointUrl,
      description: "URL do ambiente Elastic Beanstalk",
    });

    new TerraformOutput(this, "vpc_id", {
      value: vpc.id,
      description: "ID da VPC criada",
    });

    new TerraformOutput(this, "public_subnets", {
      value: Fn.join(",", [publicSubnet1.id, publicSubnet2.id]),
      description: "IDs das subnets públicas",
    });

    new TerraformOutput(this, "security_group_id", {
      value: elasticBeanstalkSecurityGroup.id,
      description: "ID do Security Group do Elastic Beanstalk",
    });

    new TerraformOutput(this, "dynamodb_table_name", {
      value: dynamodb.name,
      description: "Nome da tabela DynamoDB",
    });

    const githubActionsUser = new IamUser(this, 'github_actions_user', {
      name: `${environmentName}-github-actions`,
    });

    const githubActionsPolicyDocument = new DataAwsIamPolicyDocument(
      this,
      'github_actions_policy_document',
      {
        statement: [
          {
            effect: 'Allow',
            actions: ['*'],
            resources: ['*'],
          },
        ],
      },
    );

    const iamPolicyGithubActions = new IamPolicy(
      this,
      'iam_policy_github_actions',
      {
        name: `${environmentName}_github_actions_policy`,
        policy: githubActionsPolicyDocument.json,
      },
    );

    new IamUserPolicyAttachment(
      this,
      'iam_role_policy_attachment_github_actions',
      {
        policyArn: iamPolicyGithubActions.arn,
        user: githubActionsUser.name,
      },
    );    

  }

}