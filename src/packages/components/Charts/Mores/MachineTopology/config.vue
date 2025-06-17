<template>
  <div>
    <CollapseItem name="关系图" :expanded="true">
      <SettingItemBox name="样式">
        <setting-item name="布局">
          <n-select v-model:value="graphConfig.layout" :options="GraphLayout" size="small" />
        </setting-item>
      </SettingItemBox>
      <SettingItemBox name="标签">
        <setting-item name="展示">
          <n-select v-model:value="graphConfig.label.show" :options="LabelSwitch" size="small" />
        </setting-item>
        <setting-item name="位置">
          <n-select v-model:value="graphConfig.label.position" :options="LabelPosition" size="small" />
        </setting-item>
      </SettingItemBox>
      <SettingItemBox name="线条">
        <SettingItem name="弧线">
          <!-- 需要输入两位的小数才会变化 -->
          <n-input-number
            v-model:value="optionData.series[0].lineStyle.curveness"
            :min="0"
            :step="0.01"
            placeholder="弯曲程度"
            size="small"
          ></n-input-number>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="图例">
        <SettingItem name="颜色">
          <n-color-picker
            size="small"
            :modes="['hex']"
            v-model:value="optionData.legend.textStyle.color"
          ></n-color-picker>
        </SettingItem>
        <SettingItem name="文本">
          <n-input-number
            v-model:value="optionData.legend.textStyle.fontSize"
            :min="0"
            :step="1"
            size="small"
            placeholder="文字大小"
          >
          </n-input-number>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="力引导" v-if="optionData.series[0].force && graphConfig.layout == 'force'">
        <SettingItem name="斥力因子" v-if="optionData.series[0].force.repulsion">
          <n-input-number
            v-model:value="optionData.series[0].force.repulsion"
            :min="0"
            :step="1"
            size="small"
            placeholder="斥力因子大小"
          >
          </n-input-number>
        </SettingItem>
        <SettingItem name="引力因子" v-if="optionData.series[0].force.gravity">
          <n-input-number
            v-model:value="optionData.series[0].force.gravity"
            :min="0"
            :step="0.1"
            size="small"
            placeholder="引力因子"
          >
          </n-input-number>
        </SettingItem>
        <SettingItem name="节点距离">
          <n-input-number
            v-model:value="optionData.series[0].force.edgeLength"
            :min="0"
            :step="1"
            size="small"
            placeholder="节点距离"
          >
          </n-input-number>
        </SettingItem>
        <SettingItem name="迭代动画">
          <n-select v-model:value="graphConfig.force.layoutAnimation" :options="LayoutAnimation" size="small" />
        </SettingItem>
      <SettingItem name="节点速度">
        <n-input-number
          v-model:value="optionData.series[0].force.friction"
          :min="0"
          :step="0.1"
          size="small"
          placeholder="节点速度"
        >
        </n-input-number>
      </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="节点图标">
        <setting-item-box
          v-for="(node, index) in optionData.dataset.nodes"
          :key="node.id"
          :name="node.name"
        >
          <n-space align="center">
            <n-input v-model:value="node.symbol" size="small" placeholder="图标地址" />
            <n-upload :show-file-list="false" :custom-request="opts => iconUpload(opts, index)">
              <n-button size="small">上传</n-button>
            </n-upload>
          </n-space>
        </setting-item-box>
      </SettingItemBox>
    </CollapseItem>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, nextTick } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option, GraphLayout, LabelSwitch, LabelPosition, LayoutAnimation } from './config'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { uploadFile } from '@/api/path/project.api'
import { ResultEnum } from '@/enums/httpEnum'
import { UploadCustomRequestOptions } from 'naive-ui'
import { useSystemStore } from '@/store/modules/systemStore/systemStore'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option & GlobalThemeJsonType>,
    required: true
  }
})

const graphConfig = computed<(typeof option.series)[0]>(() => {
  return props.optionData.series[0]
})

const systemStore = useSystemStore()

const iconUpload = (options: UploadCustomRequestOptions, index: number) => {
  const { file } = options
  nextTick(async () => {
    if (file.file) {
      const formData = new FormData()
      formData.append('object', file.file)
      const uploadRes = await uploadFile(formData)
      if (uploadRes && uploadRes.code === ResultEnum.SUCCESS) {
        const url =
          uploadRes.data.fileurl || `${systemStore.getFetchInfo.OSSUrl || ''}${uploadRes.data.fileName}`
        props.optionData.dataset.nodes[index].symbol = `image://${url}`
      } else {
        window['$message'].error('上传失败，请稍后重试！')
      }
    } else {
      window['$message'].error('上传失败，请稍后重试！')
    }
  })
}
</script>
