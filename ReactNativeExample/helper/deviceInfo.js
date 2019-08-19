import DeviceInfo from "react-native-device-info";

export const getAppVersion = () => `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;

export const getDevice = () => `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`;
