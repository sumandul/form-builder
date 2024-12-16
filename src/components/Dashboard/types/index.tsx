interface Alert {
  id: number;
  alert: string;
  weather_alert_title?: string;
  alert_icon?: string;
  alert_description?: string;
  weather_alert_description?: string;
  alert_type: string;
  date_created: string;
}

// Define the structure of the Page containing alerts
export interface AlertListResponse {
  data: {
    results: Alert[];
    next?: string;
  };
}
