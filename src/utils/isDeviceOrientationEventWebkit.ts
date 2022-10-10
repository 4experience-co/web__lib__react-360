type DeviceOrientationEventWebkit = DeviceOrientationEvent & {
  webkitCompassHeading: number;
  requestPermission: () => Promise<string>;
};

const isDeviceOrientationEventWebkit = (event: Event | typeof DeviceOrientationEvent): event is DeviceOrientationEventWebkit => {
  const webkitEvent = event as DeviceOrientationEventWebkit;
  return webkitEvent.requestPermission !== undefined || webkitEvent.webkitCompassHeading !== undefined;
};

export default isDeviceOrientationEventWebkit;
