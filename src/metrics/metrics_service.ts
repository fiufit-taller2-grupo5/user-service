import axios from "axios";
import { MetricName } from "./metrics_types"

const url = "http://metrics-queue/api/metrics/system";

export const sendSystemMetric = async (metric: MetricName): Promise<void> => {
    const data = {
        metric_name: metric
    };

    try {
        await axios.post(url, data);
    } catch(err) {
        console.log("Failed sending system metric to metrics-queue");
        console.error(err);
    }
}
