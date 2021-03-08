<template>
  <div class="home">
    <h1 class="text-center">餐館搜尋系統</h1>

    <div class="map-wrapper relative shadow">
      <div id="map" class="map-container absolute top-0 left-0 w-full h-full"></div>

      <div
        :class="{ 'active': isShow }"
        class="map-search transition-all duration-700 absolute top-0 bottom-0 p-5 bg-gray-800 bg-opacity-75"
      >
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

        <div class="flex items-center mb-5">
          <input class="mr-3 px-4 py-2 w-40 border-b-2 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md" type="text" placeholder="請輸入餐廳名稱" />
          <button class="px-4 py-2 focus:outline-none bg-green-400 hover:bg-green-600 text-white rounded-md">搜尋</button>
        </div>

        <ul>
          <li class="px-4 py-2 bg-transparent hover:bg-green-400 border border-green-400 text-green-400 hover:text-white rounded-md cursor-pointer">
            Rhythmboat Cruises
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

      restaurants: [
        {
          geometry : {
            location : {
              lat : -33.870775,
              lng : 151.199025
            }
          },
          icon : 'http://maps.gstatic.com/mapfiles/place_api/icons/travel_agent-71.png',
          id : '21a0b251c9b8392186142c798263e289fe45b4aa',
          name : 'Rhythmboat Cruises',
          opening_hours : {
            open_now : true
          },
          photos : [
            {
              height : 270,
              html_attributions : [],
              photo_reference : 'CnRnAAAAF-LjFR1ZV93eawe1cU_3QNMCNmaGkowY7CnOf-kcNmPhNnPEG9W979jOuJJ1sGr75rhD5hqKzjD8vbMbSsRnq_Ni3ZIGfY6hKWmsOf3qHKJInkm4h55lzvLAXJVc-Rr4kI9O1tmIblblUpg2oqoq8RIQRMQJhFsTr5s9haxQ07EQHxoUO0ICubVFGYfJiMUPor1GnIWb5i8',
              width : 519
            }
          ],
          place_id : 'ChIJyWEHuEmuEmsRm9hTkapTCrk',
          reference : 'CoQBdQAAAFSiijw5-cAV68xdf2O18pKIZ0seJh03u9h9wk_lEdG-cP1dWvp_QGS4SNCBMk_fB06YRsfMrNkINtPez22p5lRIlj5ty_HmcNwcl6GZXbD2RdXsVfLYlQwnZQcnu7ihkjZp_2gk1-fWXql3GQ8-1BEGwgCxG-eaSnIJIBPuIpihEhAY1WYdxPvOWsPnb2-nGb6QGhTipN0lgaLpQTnkcMeAIEvCsSa0Ww',
          types : [ 'travel_agency', 'restaurant', 'food', 'establishment' ],
          vicinity : 'Pyrmont Bay Wharf Darling Dr, Sydney'
        },
        {
          geometry : {
            location : {
              lat : -33.866891,
              lng : 151.200814
            }
          },
          icon : 'http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
          id : '45a27fd8d56c56dc62afc9b49e1d850440d5c403',
          name : 'Private Charter Sydney Habour Cruise',
          photos : [
            {
              height : 426,
              html_attributions : [],
              photo_reference : 'CnRnAAAAL3n0Zu3U6fseyPl8URGKD49aGB2Wka7CKDZfamoGX2ZTLMBYgTUshjr-MXc0_O2BbvlUAZWtQTBHUVZ-5Sxb1-P-VX2Fx0sZF87q-9vUt19VDwQQmAX_mjQe7UWmU5lJGCOXSgxp2fu1b5VR_PF31RIQTKZLfqm8TA1eynnN4M1XShoU8adzJCcOWK0er14h8SqOIDZctvU',
              width : 640
            }
          ],
          place_id : 'ChIJqwS6fjiuEmsRJAMiOY9MSms',
          reference : 'CpQBhgAAAFN27qR_t5oSDKPUzjQIeQa3lrRpFTm5alW3ZYbMFm8k10ETbISfK9S1nwcJVfrP-bjra7NSPuhaRulxoonSPQklDyB-xGvcJncq6qDXIUQ3hlI-bx4AxYckAOX74LkupHq7bcaREgrSBE-U6GbA1C3U7I-HnweO4IPtztSEcgW09y03v1hgHzL8xSDElmkQtRIQzLbyBfj3e0FhJzABXjM2QBoUE2EnL-DzWrzpgmMEulUBLGrtu2Y',
          types : [ 'restaurant', 'food', 'establishment' ],
          vicinity : 'Australia'
        },
        {
          geometry : {
            location : {
              lat : -33.870943,
              lng : 151.190311
            }
          },
          icon : 'http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
          id : '30bee58f819b6c47bd24151802f25ecf11df8943',
          name : 'Bucks Party Cruise',
          opening_hours : {
            open_now : true
          },
          photos : [
            {
              height : 600,
              html_attributions : [],
              photo_reference : 'CnRnAAAA48AX5MsHIMiuipON_Lgh97hPiYDFkxx_vnaZQMOcvcQwYN92o33t5RwjRpOue5R47AjfMltntoz71hto40zqo7vFyxhDuuqhAChKGRQ5mdO5jv5CKWlzi182PICiOb37PiBtiFt7lSLe1SedoyrD-xIQD8xqSOaejWejYHCN4Ye2XBoUT3q2IXJQpMkmffJiBNftv8QSwF4',
              width : 800
            }
          ],
          place_id : 'ChIJLfySpTOuEmsRsc_JfJtljdc',
          reference : 'CoQBdQAAANQSThnTekt-UokiTiX3oUFT6YDfdQJIG0ljlQnkLfWefcKmjxax0xmUpWjmpWdOsScl9zSyBNImmrTO9AE9DnWTdQ2hY7n-OOU4UgCfX7U0TE1Vf7jyODRISbK-u86TBJij0b2i7oUWq2bGr0cQSj8CV97U5q8SJR3AFDYi3ogqEhCMXjNLR1k8fiXTkG2BxGJmGhTqwE8C4grdjvJ0w5UsAVoOH7v8HQ',
          types : [ 'restaurant', 'food', 'establishment' ],
          vicinity : '37 Bank St, Pyrmont'
        },
        {
          geometry : {
            location : {
              lat : -33.867591,
              lng : 151.201196
            }
          },
          icon : 'http://maps.gstatic.com/mapfiles/place_api/icons/travel_agent-71.png',
          id : 'a97f9fb468bcd26b68a23072a55af82d4b325e0d',
          name : 'Australian Cruise Group',
          opening_hours : {
            open_now : true
          },
          photos : [
            {
              height : 242,
              html_attributions : [],
              photo_reference : 'CnRnAAAABjeoPQ7NUU3pDitV4Vs0BgP1FLhf_iCgStUZUr4ZuNqQnc5k43jbvjKC2hTGM8SrmdJYyOyxRO3D2yutoJwVC4Vp_dzckkjG35L6LfMm5sjrOr6uyOtr2PNCp1xQylx6vhdcpW8yZjBZCvVsjNajLBIQ-z4ttAMIc8EjEZV7LsoFgRoU6OrqxvKCnkJGb9F16W57iIV4LuM',
              width : 200
            }
          ],
          place_id : 'ChIJrTLr-GyuEmsRBfy61i59si0',
          reference : 'CoQBeQAAAFvf12y8veSQMdIMmAXQmus1zqkgKQ-O2KEX0Kr47rIRTy6HNsyosVl0CjvEBulIu_cujrSOgICdcxNioFDHtAxXBhqeR-8xXtm52Bp0lVwnO3LzLFY3jeo8WrsyIwNE1kQlGuWA4xklpOknHJuRXSQJVheRlYijOHSgsBQ35mOcEhC5IpbpqCMe82yR136087wZGhSziPEbooYkHLn9e5njOTuBprcfVw',
          types : [ 'travel_agency', 'restaurant', 'food', 'establishment' ],
          vicinity : '32 The Promenade, King Street Wharf 5, Sydney'
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    toggleSearch() {
      this.isShow = !this.isShow;
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
