import * as THREE from "three";

class DeviceOrientationControlsYawFixer {
  magicWindowAbsoluteEuler = new THREE.Euler();

  magicWindowDeltaEuler = new THREE.Euler();

  previousMagicWindowYaw = 0;

  getYawFixedRotation(quaternion: THREE.Quaternion) {
    this.magicWindowAbsoluteEuler.setFromQuaternion(quaternion, "YXZ");

    if (!this.previousMagicWindowYaw && this.magicWindowAbsoluteEuler.y !== 0) {
      this.previousMagicWindowYaw = this.magicWindowAbsoluteEuler.y;
    }

    if (this.previousMagicWindowYaw) {
      this.magicWindowDeltaEuler.x = this.magicWindowAbsoluteEuler.x;
      this.magicWindowDeltaEuler.y += this.magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
      this.magicWindowDeltaEuler.z = this.magicWindowAbsoluteEuler.z;
      this.previousMagicWindowYaw = this.magicWindowAbsoluteEuler.y;
    }
    
    const fixedEuler = new THREE.Euler(this.magicWindowDeltaEuler.x, this.magicWindowDeltaEuler.y, this.magicWindowDeltaEuler.z);
    return fixedEuler;
  }
}

export default DeviceOrientationControlsYawFixer;
