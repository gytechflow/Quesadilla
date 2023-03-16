// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


const UrlComponents = {
  CORS_URL:'https://frozen-spire-62451.herokuapp.com/',
  SERVER_URL:'https://quesadilla-saarlouis.merchant-scalable.com/api/index.php/',
}

export const environment = {
  production: true,
  REQUEST_URL: UrlComponents.CORS_URL + UrlComponents.SERVER_URL,
  BOOKING_ENDPOINT:'agendaevents',
  COUPON_ENDPOINT:'couponsapi/coupons',
  TABLES_ENDPOINT: 'takepos/freetable',
  BOOKING_TYPE_ENDPOINT: 'agendaevents/typebooking',
  API_KEY: '12825d52ce2a321c7a64ff8bde75ba135af2a26a',
  CATEGORIES_ENDPOINT:'categories',
  PRODUCTS_ENDPOINT:'products',
  ORDER_ENDPOINT: 'orders',
  DOCUMENTS_ENDPOINT: 'documents',
  THIRDPARTIES_ENDPOINT:'thirdparties',
  SETUP_MAILTEMPLATE_ENDPOINT:'setup/mailtemplate',
  SETUP_ENDPOINT: 'setup/conf',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
