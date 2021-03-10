<template>
  <div class="control-panel my-10 px-5">

    <!-- 換地圖樣式 -->
    <h3 class="mb-1 font-bold text-xl">換地圖樣式</h3>
    <div class="mb-3">
      <button
        :class="[
          mapType === 'roadmap' ?
            'bg-green-400 hover:bg-green-600 border-green-400 text-white' :
            'bg-transparent hover:bg-green-600 border-green-600 text-green-400 hover:text-white'
        ]"
        class="px-4 py-2 mr-2 focus:outline-none border rounded-md"
        @click="$emit('onSetMapType', 'roadmap')"
      >
        道路圖
      </button>

      <button
        :class="[
          mapType === 'satellite' ?
            'bg-green-400 hover:bg-green-600 border-green-400 text-white' :
            'bg-transparent hover:bg-green-600 border-green-600 text-green-400 hover:text-white'
        ]"
        class="px-4 py-2 mr-2 focus:outline-none border rounded-md"
        @click="$emit('onSetMapType', 'satellite')"
      >
        衛星圖
      </button>

      <button
        :class="[
          mapType === 'hybrid' ?
            'bg-green-400 hover:bg-green-600 border-green-400 text-white' :
            'bg-transparent hover:bg-green-600 border-green-600 text-green-400 hover:text-white'
        ]"
        class="px-4 py-2 mr-2 focus:outline-none border rounded-md"
        @click="$emit('onSetMapType', 'hybrid')"
      >
        正常+衛星圖
      </button>

      <button
        :class="[
          mapType === 'terrain' ?
            'bg-green-400 hover:bg-green-600 border-green-400 text-white' :
            'bg-transparent hover:bg-green-600 border-green-600 text-green-400 hover:text-white'
        ]"
        class="px-4 py-2 mr-2 focus:outline-none border rounded-md"
        @click="$emit('onSetMapType', 'terrain')"
      >
        地形圖
      </button>
    </div>

    <!-- 隱藏商家 -->
    <h3 class="mb-1 font-bold text-xl">隱藏商家</h3>
    <div class="mb-3">
      <button
        :class="[
          !isHideBusiness ?
            'bg-green-600 border-green-600 text-white' :
            'bg-green-400 border-green-400 text-white'
        ]"
        class="px-4 py-2 focus:outline-none border rounded-l-md"
        @click="$emit('onHideBusiness', false)"
      >
        顯示
      </button>

      <button
        :class="[
          isHideBusiness ?
            'bg-green-600 border-green-600 text-white' :
            'bg-green-400 border-green-400 text-white'
        ]"
        class="px-4 py-2 focus:outline-none border rounded-r-md"
        @click="$emit('onHideBusiness', true)"
      >
        隱藏
      </button>
    </div>

    <!-- 夜間模式 -->
    <h3 class="mb-1 font-bold text-xl">夜間模式</h3>
    <div class="mb-3">
      <button
        :class="[
          themeMode === 'night' ?
            'bg-green-600 border-green-600 text-white' :
            'bg-green-400 border-green-400 text-white'
        ]"
        class="px-4 py-2 focus:outline-none border rounded-l-md"
        @click="$emit('onSetThemeMode', 'night')"
      >
        開啟
      </button>

      <button
        :class="[
          themeMode === 'day' ?
            'bg-green-600 border-green-600 text-white' :
            'bg-green-400 border-green-400 text-white'
        ]"
        class="px-4 py-2 focus:outline-none border rounded-r-md"
        @click="$emit('onSetThemeMode', 'day')"
      >
        關閉
      </button>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    mapType: {
      type: String,
      required: true,
    },
    isHideBusiness: {
      type: Boolean,
      required: true,
    },
    themeMode: {
      type: String,
      required: true,
    },
  },
}
</script>
