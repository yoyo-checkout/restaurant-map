<template>
  <div class="home">

    <h1 class="my-8 font-bold text-lg text-center">餐館搜尋系統</h1>

    <div class="map-wrapper relative">
      <div id="map" class="map-container absolute top-0 left-0 w-full h-full shadow"></div>

      <SearchSidebar
        :isSidebarActive="isSidebarActive"
        :sort="sort"
        :restaurants="restaurants"
        :location="location"
        @onToggle="toggleSearchSidebar"
        @onSearch="nearbySearch"
        @onSort="sortRestaurantsBy"
        @onOpenInfoWindow="openInfoWindow"
        @onDrawDirection="drawDirection"
      />
    </div>

    <ControlPanel
      :mapType="mapType"
      :isHideBusiness="isHideBusiness"
      :themeMode="themeMode"
      @onSetMapType="setMapType"
      @onHideBusiness="hideBusiness"
      @onSetThemeMode="setThemeMode"
    />

  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapMutations } from 'vuex';
import '@/library/gMap';

import SearchSidebar from '@/components/SearchSidebar';
import ControlPanel from '@/components/ControlPanel';

export default {
  name: 'Home',
  components: {
    SearchSidebar,
    ControlPanel,
  },
  data() {
    return {
      // gMap instances
      map: null,
      infoWindow: null,
      directionsService: null,
      directionsRenderer: null,

      // search sidebar
      isSidebarActive: true,
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

    nearbySearch(keyword) {
      const request = {
        location: this.map.getCenter(),
        radius: '5000',
        type: ['restaurant'],
        keyword,
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
}
</style>
