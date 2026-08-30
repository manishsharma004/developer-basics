import type { ComponentType } from 'react'
import * as docker from './tracks/dockerChapters.tsx'
import * as compose from './tracks/composeChapters.tsx'
import * as k8s from './tracks/k8sChapters.tsx'
import * as platform from './tracks/platformChapters.tsx'

export const CONTAINERIZATION_CHAPTERS: Record<string, ComponentType> = {
  'container-intro': docker.containerIntro,
  'docker-images': docker.dockerImages,
  'docker-containers': docker.dockerContainers,
  'docker-dockerfile': docker.dockerDockerfile,
  'docker-networks': docker.dockerNetworks,
  'docker-volumes': docker.dockerVolumes,
  'compose-intro': compose.composeIntro,
  'compose-services': compose.composeServices,
  'compose-production': compose.composeProduction,
  'k8s-intro': k8s.k8sIntro,
  'k8s-architecture': k8s.k8sArchitecture,
  'k8s-workloads': k8s.k8sWorkloads,
  'k8s-services': k8s.k8sServices,
  'k8s-ingress': k8s.k8sIngress,
  'k8s-networking': k8s.k8sNetworking,
  'k8s-storage': k8s.k8sStorage,
  'k8s-config-secrets': k8s.k8sConfigSecrets,
  'k8s-commands': k8s.k8sCommands,
  'k8s-nodes': k8s.k8sNodes,
  'k8s-operators-builtin': k8s.k8sOperatorsBuiltin,
  'k8s-operators-custom': k8s.k8sOperatorsCustom,
  'platforms-managed-k8s': platform.platformsManagedK8s,
  'platforms-ecs-rancher': platform.platformsEcsRancher,
  'container-capstone': platform.containerCapstone,
}
