<template>
  <div
    :class="{ 'active': isSidebarActive }"
    class="map-search transition-all duration-700 flex flex-col absolute top-0 bottom-0 p-5 bg-gray-800 bg-opacity-75"
  >
    <!-- toggle button -->
    <button
      class="absolute top-0 -right-10 w-10 h-10 focus:outline-none bg-gray-300 rounded-r-md shadow"
      @click="$emit('onToggle')"
    >
      <svg v-show="!isSidebarActive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <svg v-show="isSidebarActive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- search area -->
    <div class="flex items-center mb-5">
      <input
        v-model="searchKeyword"
        class="mr-3 px-4 py-2 w-40 border-b-2 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md"
        type="text"
        placeholder="請輸入餐廳名稱"
      />
      <button
        class="px-4 py-2 focus:outline-none bg-green-400 hover:bg-green-600 text-white rounded-md"
        @click="$emit('onSearch', searchKeyword)"
      >
        搜尋
      </button>
    </div>

    <!-- sort buttons -->
    <div class="flex items-center mb-5">
      <button
        class="flex items-center mr-2 px-3 py-2 focus:outline-none bg-green-400 hover:bg-green-600 text-white rounded-md"
        @click="$emit('onSort', 'distance')"
      >
        <span class="mr-1">距離</span>
        <span v-show="sort.distance === 'asc'" class="w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-show="sort.distance === 'desc'" class="w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>

      <button
        class="flex items-center px-3 py-2 focus:outline-none bg-green-400 hover:bg-green-600 text-white rounded-md"
        @click="$emit('onSort', 'rating')"
      >
        <span class="mr-1">評分</span>
        <span v-show="sort.rating === 'asc'" class="w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-show="sort.rating === 'desc'" class="w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>
    </div>

    <!-- suggestions -->
    <ul class="flex-grow overflow-y-scroll">
      <li
        v-for="restaurant in restaurants"
        :key="restaurant.place_id"
        class="mb-4 px-4 py-2 bg-transparent hover:bg-green-600 border border-green-600 text-green-400 hover:text-white rounded-md cursor-pointer"
        @click="$emit('onOpenInfoWindow', restaurant)"
      >
        <div>{{ restaurant.name }}</div>

        <div class="flex justify-between">
          <span>評分: {{ restaurant.rating }}</span>
          <span>{{ calcDistance(location, getLocationObject(restaurant.geometry.location)) }} 公里</span>
        </div>

        <div class="mt-2 text-right">
          <button
            class="px-3 py-2 focus:outline-none bg-green-700 hover:bg-green-900 text-white rounded-md"
            @click.stop="$emit('onDrawDirection', restaurant.geometry.location)"
          >
            規劃路線
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    sort: {
      type: Object,
      required: true,
    },
    restaurants: {
      type: Array,
      required: true,
    },
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchKeyword: '',
    };
  },
  methods: {
    getLocationObject(location) {
      return {
        lat: location.lat(),
        lng: location.lng(),
      };
    },
    calcDistance(origin, destination) {
      return gMap.calcDistance(origin, destination);
    },
  },
}
</script>

<style lang="scss" scoped>
.map {
  &-search {
    left: -300px;
    min-height: 500px;
    max-height: 700px;
    width: 300px;

    &.active {
      left: 0;
    }
  }
}
</style>
