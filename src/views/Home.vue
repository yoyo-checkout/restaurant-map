<template>
  <div class="home">
    <h1 class="my-8 font-bold text-lg text-center">餐館搜尋系統</h1>

    <div class="map-wrapper relative">
      <div id="map" class="map-container absolute top-0 left-0 w-full h-full shadow"></div>

      <div
        :class="{ 'active': isSidebarActive }"
        class="map-search transition-all duration-700 flex flex-col absolute top-0 bottom-0 p-5 bg-gray-800 bg-opacity-75"
      >
        <!-- toggle button -->
        <button
          class="absolute top-0 -right-10 w-10 h-10 focus:outline-none bg-gray-300 rounded-r-md shadow"
          @click="toggleSearchSidebar"
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
            @click="nearbySearch"
          >
            搜尋
          </button>
        </div>

        <!-- search area -->
        <div class="flex items-center mb-5">
          <button
            class="flex items-center mr-2 px-3 py-2 focus:outline-none bg-green-400 hover:bg-green-600 text-white rounded-md"
            @click="sortRestaurantsBy('distance')"
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
            @click="sortRestaurantsBy('rating')"
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
            @click="openInfoWindow(restaurant)"
          >
            <div>{{ restaurant.name }}</div>

            <div class="flex justify-between">
              <span>評分: {{ restaurant.rating }}</span>
              <span>{{ calcDistance(location, getLocationObject(restaurant.geometry.location)) }} 公里</span>
            </div>

            <div class="mt-2 text-right">
              <button
                class="px-3 py-2 focus:outline-none bg-green-700 hover:bg-green-900 text-white rounded-md"
                @click.stop="drawDirection(restaurant.geometry.location)"
              >
                規劃路線
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="control-panel my-10 px-5">

      <h3 class="mb-1 font-bold text-xl">換地圖樣式</h3>
      <div class="mb-3">
        <button
          :class="[
            mapType === 'roadmap' ?
              'bg-green-400 hover:bg-green-600 border-green-400 text-white' :
              'bg-transparent hover:bg-green-600 border-green-600 text-green-400 hover:text-white'
          ]"
          class="px-4 py-2 mr-2 focus:outline-none border rounded-md"
          @click="setMapType('roadmap')"
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
          @click="setMapType('satellite')"
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
          @click="setMapType('hybrid')"
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
          @click="setMapType('terrain')"
        >
          地形圖
        </button>
      </div>

      <h3 class="mb-1 font-bold text-xl">隱藏商家</h3>
      <div class="mb-3">
        <button
          :class="[
            !isHideBusiness ?
              'bg-green-600 border-green-600 text-white' :
              'bg-green-400 border-green-400 text-white'
          ]"
          class="px-4 py-2 focus:outline-none border rounded-l-md"
          @click="hideBusiness(false)"
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
          @click="hideBusiness(true)"
        >
          隱藏
        </button>
      </div>

      <h3 class="mb-1 font-bold text-xl">夜間模式</h3>
      <div class="mb-3">
        <button
          :class="[
            themeMode === 'night' ?
              'bg-green-600 border-green-600 text-white' :
              'bg-green-400 border-green-400 text-white'
          ]"
          class="px-4 py-2 focus:outline-none border rounded-l-md"
          @click="setThemeMode('night')"
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
          @click="setThemeMode('day')"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapMutations } from 'vuex';
import '@/library/gMap';

export default {
  name: 'Home',
  data() {
    return {
      // gMap instances
      map: null,
      infoWindow: null,
      directionsService: null,
      directionsRenderer: null,

      // search sidebar
      isSidebarActive: true,
      searchKeyword: '',
      sort: {
        distance: '',
        rating: '',
      },

      // map settings
      location: { // 預設顯示的地點：台北市政府親子劇場
        lat: 25.0374865, // 經度
        lng: 121.5647688 // 緯度
      },
      isHideBusiness: false,
      mapType: 'roadmap',
      themeMode: 'day',
    };
  },
  computed: {
    ...mapState('map', {
      restaurants: state => state.restaurants,
      markers: state => state.markers,
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations('map', [
      'SET_RESTAURANTS',
      'SET_MARKERS',
    ]),

    // init methods
    async init() {
      await this.initLocation(); // 初始化位置
      await this.initMap(); // 建立地圖
      this.initInfoWindow(); // 建立資訊視窗
      this.initDirections(); // 載入路線服務與圖層
    },
    async initLocation() {
      this.location = await gMap.setLocation(this.location);
    },
    initMap() {
      this.map = gMap.map
        .Create(document.getElementById('map'), {
          center: this.location,
          zoom: 14, // 1-20，數字愈大，地圖愈細：1是世界地圖，20就會到街道
          mapTypeId: 'roadmap',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        })
        .addListener('bounds_changed', _.debounce(this.nearbySearch, 1000));
    },
    initInfoWindow() {
      this.infoWindow = gMap.infoWindow.Create({
        disableAutoPan: true,
      });
    },
    initDirections() {
      this.directionsService = gMap.directionsService.Create();
      this.directionsRenderer = gMap.directionsRenderer
        .Create()
        .setMap(this.map.getInstance());
    },

    nearbySearch() {
      const request = {
        location: this.map.getCenter(),
        radius: '5000',
        type: ['restaurant'],
        keyword: this.searchKeyword,
      };

      gMap.placesService
        .Create(this.map.getInstance())
        .nearbySearch(request, (res, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(res);

            this.SET_RESTAURANTS(res)
            this.drawMarkers();
          } else {
            console.log('error req');
          }
        });
    },
    clearMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }

      this.SET_MARKERS([]);
    },
    drawMarkers() {
      this.clearMarkers(); // 清除先前建立的標記

      const newMarkers = [];
      this.restaurants.forEach(restaurant => {
        const marker = gMap.marker
          .Create({
            position: this.getLocationObject(restaurant.geometry.location),
            map: this.map.getInstance(),
          })
          .addListener('click', () => this.openInfoWindow(restaurant));

        newMarkers.push(marker);
      });
      this.SET_MARKERS(newMarkers);
    },
    openInfoWindow(restaurant) {
      this.clearDirections(); // 清除其他規劃路線

      // 找到對應標記
      const restaurantLocation = this.getLocationObject(restaurant.geometry.location);
      const targetMarker = this.markers.find(marker => {
        return marker.getPosition().lat() === restaurantLocation.lat &&
          marker.getPosition().lng() === restaurantLocation.lng;
      });

      // 開啟資訊視窗
      this.infoWindow
        .setContent(`
          <h1 class="font-bold text-base">${restaurant.name}</h1>
          <p>${restaurant.vicinity}</p>
          <a class="text-blue-900 hover:underline" href="https://www.google.com.tw/maps/search/${restaurant.vicinity}" target="_blank">
            在地圖上檢視
          </a>
        `)
        .open(this.map.getInstance(), targetMarker.getInstance());
    },
    clearDirections() {
      this.directionsRenderer.clearDirections();
    },
    drawDirection(destination) {
      const request = {
        origin: this.location,
        destination: this.getLocationObject(destination),
        travelMode: 'DRIVING',
      };

      // 繪製路線
      this.directionsService.route(request, (res, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(res);
        } else {
          console.log('error req');
        }
      });
    },
    sortRestaurantsBy(sortType) {
      const currentOrder = this.sort[sortType];
      const newOrder = currentOrder === '' ? 'asc'
        : currentOrder === 'asc' ? 'desc' : '';

      // 重置其他排序類別
      for (let type in this.sort) {
        if (type === sortType) {
          this.sort[type] = newOrder;
        } else {
          this.sort[type] = '';
        }
      }

      if (!newOrder) return;

      const sorted = [ ...this.restaurants ].sort((a, b) => {
        if (sortType === 'distance') {
          const aDistance = this.calcDistance(this.location, this.getLocationObject(a.geometry.location));
          const bDistance = this.calcDistance(this.location, this.getLocationObject(b.geometry.location));

          return newOrder === 'asc' ? aDistance - bDistance : bDistance - aDistance;
        }

        return newOrder === 'asc' ? a[sortType] - b[sortType] : b[sortType] - a[sortType];
      });
      this.SET_RESTAURANTS(sorted);
    },
    setMapType(newType) {
      if (newType === this.mapType) return;

      this.mapType = newType;
      this.map.setType(newType);
    },
    setThemeMode(newMode) {
      if (newMode === this.themeMode) return;

      this.themeMode = newMode;
      this.map.setThemeMode(newMode);
    },
    hideBusiness(newBool) {
      if (newBool === this.isHideBusiness) return;

      this.isHideBusiness = newBool;
      this.map.hideBusiness(newBool);
    },
    toggleSearchSidebar() {
      this.isSidebarActive = !this.isSidebarActive;
    },
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
  &-wrapper {
    padding-top: 56.25%;
    min-height: 500px;
    max-height: 700px;
  }

  &-container {
    min-height: 500px;
    max-height: 700px;
  }

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
