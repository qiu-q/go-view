import { ConfigType, PackagesCategoryEnum, ChartFrameEnum } from '@/packages/index.d'
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d'

export const MachineTopologyConfig: ConfigType = {
  key: 'MachineTopology',
  chartKey: 'VMachineTopology',
  conKey: 'VCMachineTopology',
  title: '拓扑图',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image: 'graph.png'
}
