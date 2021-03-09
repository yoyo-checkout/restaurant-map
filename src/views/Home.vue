<template>
  <div class="home">
    <h1 class="text-center">餐館搜尋系統</h1>

    <div class="map-wrapper relative">
      <div id="map" class="map-container absolute top-0 left-0 w-full h-full shadow"></div>

      <div
        :class="{ 'active': isShow }"
        class="map-search transition-all duration-700 flex flex-col absolute top-0 bottom-0 p-5 bg-gray-800 bg-opacity-75"
      >
        <!-- toggle button -->
        <button
          class="absolute top-0 -right-10 w-10 h-10 focus:outline-none bg-gray-300 rounded-r-md shadow"
          @click="toggleSearch"
        >
          <svg v-show="!isShow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <svg v-show="isShow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <!-- suggestions -->
        <ul class="flex-grow overflow-y-scroll">
          <li
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            class="mb-4 px-4 py-2 bg-transparent hover:bg-green-400 border border-green-400 text-green-400 hover:text-white rounded-md cursor-pointer"
          >
            {{ restaurant.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      map: null,
      isShow: false,
      searchKeyword: '',
      restaurants: [],
      markers: [],

      // 預設顯示的地點：台北市政府親子劇場
      location: {
        lat: 25.0374865, // 經度
        lng: 121.5647688 // 緯度
      },
    };
  },
  async mounted() {
    await this.initMap();
    await this.nearbySearch();
  },
  methods: {
    toggleSearch() {
      this.isShow = !this.isShow;
    },

    // init google map
    initMap() {
      // 建立地圖
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: this.location, // 中心點座標
        zoom: 16, // 1-20，數字愈大，地圖愈細：1是世界地圖，20就會到街道
        /*
          roadmap 顯示默認道路地圖視圖。
          satellite 顯示 Google 地球衛星圖像。
          hybrid 顯示正常和衛星視圖的混合。
          terrain 顯示基於地形信息的物理地圖。
        */
        mapTypeId: 'roadmap',
      });
    },
    nearbySearch() {
      const request = {
        location: this.location,
        radius: '1000',
        type: ['restaurant'],
        keyword: this.searchKeyword,
      };

      const service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch(request, (res, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(res);
          this.restaurants = [ ...res ];

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

      this.markers = [];
    },
    drawMarkers() {
      this.clearMarkers();

      this.restaurants.forEach(restaurant => {
        const latLng = new google.maps.LatLng(restaurant.geometry.location.lat(), restaurant.geometry.location.lng());

        const marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
        });

        this.markers.push(marker);
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.map {
  &-wrapper {
    padding-top: 56.25%;
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
