let url = "127.0.0.1:3000";
if (typeof (window as any).MICRO_SERVICE_URL !== "undefined") {
    url = (window as any).MICRO_SERVICE_URL as string;
}
import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Notification publisher
*/
class NotificationPublisherClient {
}

export default NotificationPublisherClient;