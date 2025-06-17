import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { MachineTopologyConfig } from './index'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = []

export const option = {
  dataset: { ...dataJson },
  tooltip: {},
  legend: {
    show: true,
    textStyle: {
      color: '#eee',
      fontSize: 14
    },
    data: dataJson.categories.map(a => a.name)
  },
  series: [
    {
      type: 'graph',
      layout: 'none',
      data: dataJson.nodes,
      links: dataJson.links,
      categories: dataJson.categories,
      label: {
        show: 1,
        position: 'right',
        formatter: '{b}'
      },
      labelLayout: {
        hideOverlap: true
      },
      lineStyle: {
        color: 'source',
        curveness: 0.2
      },
      force: {
        repulsion: 100,
        gravity: 0.1,
        edgeLength: 30,
        layoutAnimation: 1,
        friction: 0.6
      }
    }
  ]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = MachineTopologyConfig.key
  public chartConfig = cloneDeep(MachineTopologyConfig)
  public option = echartOptionProfixHandle(option, includes)
}
