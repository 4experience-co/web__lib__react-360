const isDeviceOrientationEvent = (event: Event): event is DeviceOrientationEvent => (event as DeviceOrientationEvent).alpha !== undefined;

export default isDeviceOrientationEvent;
