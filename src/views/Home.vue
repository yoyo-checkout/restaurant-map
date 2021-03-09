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
            @click="infoWindowHandler(restaurant)"
          >
            <div>{{ restaurant.name }}</div>

            <div class="flex justify-between">
              <span>評分: {{ restaurant.rating }}</span>
              <span>{{ calcDistance(location, getDestinationLocation(restaurant.geometry.location)) }} 公里</span>
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
          @click="changeMapType('roadmap')"
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
          @click="changeMapType('satellite')"
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
          @click="changeMapType('hybrid')"
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
          @click="changeMapType('terrain')"
        >
          地形圖
        </button>
      </div>

      <h3 class="mb-1 font-bold text-xl">隱藏商家</h3>
      <div class="mb-3">
        <button
          :class="[
            !hideBusiness ?
              'bg-green-600 border-green-600 text-white' :
              'bg-green-400 border-green-400 text-white'
          ]"
          class="px-4 py-2 focus:outline-none border rounded-l-md"
          @click="toggleHideBusiness(false)"
        >
          顯示
        </button>

        <button
          :class="[
            hideBusiness ?
              'bg-green-600 border-green-600 text-white' :
              'bg-green-400 border-green-400 text-white'
          ]"
          class="px-4 py-2 focus:outline-none border rounded-r-md"
          @click="toggleHideBusiness(true)"
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
          @click="toggleThemeMode('night')"
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
          @click="toggleThemeMode('day')"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'Home',
  data() {
    return {
      map: null,
      infowindow: null,
      directionsService: null,
      directionLayer: null,
      isShow: true,
      searchKeyword: '',
      sort: {
        distance: '',
        rating: '',
      },
      restaurants: [],
      markers: [],

      // 預設顯示的地點：台北市政府親子劇場
      location: {
        lat: 25.0374865, // 經度
        lng: 121.5647688 // 緯度
      },

      mapType: 'roadmap',
      hideBusiness: false,
      hideStyles: [
        {
          featureType: 'poi.business',
          stylers: [{
            visibility: 'off',
          }],
        },
      ],
      themeMode: 'day',
      nightModeStyles: [
        { elementType: 'geometry', stylers: [{color: '#242f3e'}] },
        { elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}] },
        { elementType: 'labels.text.fill', stylers: [{color: '#746855'}] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ],
    };
  },
  async mounted() {
    await this.initLocation();
    await this.initMap();

    google.maps.event.addListener(this.map, 'bounds_changed', _.debounce(this.nearbySearch, 1000));
  },
  methods: {
    changeMapType(newType) {
      if (newType === this.mapType) return;

      this.mapType = newType;
      this.map.setOptions({
        mapTypeId: newType,
      });
    },
    toggleHideBusiness(newBool) {
      if (newBool === this.hideBusiness) return;

      this.hideBusiness = newBool;

      const hideStyles = newBool ? this.hideStyles : [];
      const themeStyles = this.themeMode === 'night' ? this.nightModeStyles : [];

      this.map.setOptions({
        styles: [ ...hideStyles, ...themeStyles],
      });
    },
    toggleThemeMode(newMode) {
      if (newMode === this.themeMode) return;

      this.themeMode = newMode;

      const hideStyles = this.hideBusiness ? this.hideStyles : [];
      const themeStyles = newMode === 'night' ? this.nightModeStyles : [];

      this.map.setOptions({
        styles: [ ...hideStyles, ...themeStyles],
      });
    },

    initLocation() {
      if (navigator.geolocation) {
        return new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(
            pos => {
              this.location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };

              resolve();
            },
            err => {
              // user deny permission or an another err
              resolve();
            }
          );
        });
      }

      return;
    },
    sortRestaurantsBy(sortType) {
      const currentOrder = this.sort[sortType];
      const newOrder = currentOrder === '' ? 'asc'
        : currentOrder === 'asc' ? 'desc' : '';

      // reset other sorting type
      for (let type in this.sort) {
        if (type === sortType) {
          this.sort[type] = newOrder;
        } else {
          this.sort[type] = '';
        }
      }

      if (!newOrder) return;

      this.restaurants.sort((a, b) => {
        if (sortType === 'distance') {
          const aDistance = this.calcDistance(this.location, this.getDestinationLocation(a.geometry.location));
          const bDistance = this.calcDistance(this.location, this.getDestinationLocation(b.geometry.location));

          return newOrder === 'asc' ? aDistance - bDistance : bDistance - aDistance;
        }

        return newOrder === 'asc' ? a[sortType] - b[sortType] : b[sortType] - a[sortType];
      });
    },
    toggleSearch() {
      this.isShow = !this.isShow;
    },

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

      // 建立資訊視窗
      this.infowindow = new google.maps.InfoWindow({
        disableAutoPan: true,
      });

      // 載入路線服務與圖層
      this.directionsService = new google.maps.DirectionsService();
      this.directionLayer = new google.maps.DirectionsRenderer();
      // 放置路線圖層
      this.directionLayer.setMap(this.map);
    },
    nearbySearch() {
      const request = {
        location: this.map.getCenter(),
        radius: '1000',
        type: ['restaurant'],
        keyword: this.searchKeyword,
      };

      const placeService = new google.maps.places.PlacesService(this.map);
      placeService.nearbySearch(request, (res, status) => {
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

        // open infowindow while clicking marker
        marker.addListener('click', () => this.infoWindowHandler(restaurant, marker));

        this.markers.push(marker);
      });
    },
    infoWindowHandler(info, marker) {
      this.clearDirection();

      let target = marker;

      if (!target) {
        target = this.markers.find(ele => {
          return ele.position.lat() === info.geometry.location.lat() && ele.position.lng() === info.geometry.location.lng();
        });
      }

      this.infowindow.setContent(`
        <h1 class="font-bold text-base">${info.name}</h1>
        <p>${info.vicinity}</p>
        <a class="text-blue-900 hover:underline" href="https://www.google.com.tw/maps/search/${info.vicinity}" target="_blank">在地圖上檢視</a>
      `);
      this.infowindow.open(this.map, target);
    },
    clearDirection() {
      this.directionLayer.set('directions', null);
    },
    drawDirection(destination) {
      // 路線相關設定
      const request = {
        origin: this.location,
        destination: this.getDestinationLocation(destination),
        travelMode: 'DRIVING',
      };

      // 繪製路線
      this.directionsService.route(request, (res, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionLayer.setDirections(res);
        } else {
          console.log('error req');
        }
      });
    },
    getDestinationLocation(location) {
      // return object for calc distance or direction
      return {
        lat: location.lat(),
        lng: location.lng(),
      };
    },
    calcDistance(origin, destination) {
      // avoid to calc math formula error
      if ((origin.lat == destination.lat) && (origin.lng == destination.lng)) {
        return 0;
      }

      const EARTH_RADIUS = 6378.137;

      const radLat1 = Math.PI * origin.lat / 180;
      const radLat2 = Math.PI * destination.lat / 180;
      const latDiff = radLat1 - radLat2;

      const radLng1 = Math.PI * origin.lng / 180;
      const radLng2 = Math.PI * destination.lng / 180;
      const lngDiff = radLng1 - radLng2;

      let s = 2 * Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(latDiff/2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(lngDiff/2), 2)
        )
      );

      s *= EARTH_RADIUS;
      s = Math.round(s * 10) / 10;

      return s;
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
