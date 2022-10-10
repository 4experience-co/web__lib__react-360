import * as THREE from "three";

import DeviceOrientationControlsYawFixer from "./DeviceOrientationControlsYawFixer";

class DeviceOrientationControls {
  enabled = true;

  deviceOrientation = {
    alpha: 0,
    beta: 0,
    gamma: 0
  };

  screenOrientation = 0;

  yawFixer = new DeviceOrientationControlsYawFixer();

  alphaOffset = THREE.MathUtils.degToRad(0);

  alpha = 0;

  onDeviceOrientationChangeEventHandler: (event: DeviceOrientationEvent) => void = this.onDeviceOrientationChangeEvent.bind(this);

  onScreenOrientationChangeEventHandler: () => void = this.onScreenOrientationChangeEvent.bind(this);

  constructor() {
    this.connect();
  }

  dispose() {
    this.disconnect();
  }

  private onDeviceOrientationChangeEvent(event: DeviceOrientationEvent) {
    this.alpha = 1;
    this.deviceOrientation = { alpha: event.alpha || 0, beta: event.beta || 0, gamma: event.gamma || 0 };
  }

  private onScreenOrientationChangeEvent() {
    this.screenOrientation = window.orientation || 0;
  }

  private connect() {
    this.onScreenOrientationChangeEvent();

    this.onScreenOrientationChangeEventHandler = this.onScreenOrientationChangeEvent.bind(this);
    this.onDeviceOrientationChangeEventHandler = this.onDeviceOrientationChangeEvent.bind(this);

    window.addEventListener("orientationchange", this.onScreenOrientationChangeEventHandler, false);
    window.addEventListener("deviceorientation", this.onDeviceOrientationChangeEventHandler, false);

    this.enabled = true;
  }

  private disconnect() {
    window.removeEventListener("orientationchange", this.onScreenOrientationChangeEventHandler, false);
    window.removeEventListener("deviceorientation", this.onDeviceOrientationChangeEventHandler, false);

    this.enabled = false;
  }

  zee = new THREE.Vector3(0, 0, 1);

  euler = new THREE.Euler();

  q0 = new THREE.Quaternion();

  q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

  private calculateRotation(alpha: number, beta: number, gamma: number, orient: number) {
    this.euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us
    const quaternion = new THREE.Quaternion();

    quaternion.setFromEuler(this.euler);
    quaternion.multiply(this.q1);
    quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient));

    // const fixedEuler = this.yawFixer.getYawFixedRotation(quaternion);

    return quaternion;
  }

  getRotation() {
    let rotation = new THREE.Quaternion();

    if (this.enabled === false) {
      return rotation;
    }

    const device = this.deviceOrientation;

    if (device) {
      const alpha = device.alpha ? THREE.MathUtils.degToRad(device.alpha) + this.alphaOffset : 0; // Z

      const beta = device.beta ? THREE.MathUtils.degToRad(device.beta) : 0; // X'

      const gamma = device.gamma ? THREE.MathUtils.degToRad(device.gamma) : 0; // Y''

      const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0; // O

      rotation = this.calculateRotation(alpha, beta, gamma, orient);
    }
    return rotation;
  }
}
export default DeviceOrientationControls;
