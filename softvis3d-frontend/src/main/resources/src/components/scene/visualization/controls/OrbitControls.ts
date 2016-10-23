import {MOUSE, Projector, Quaternion, Spherical, Vector3, Vector2, PerspectiveCamera, OrthographicCamera} from "three";
import {OrbitControlsOptions} from "./OrbitControlsOptions";

/**
 * Typescript version of the Orbitscontrols.js.
 *
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };
const EPS = 0.000001;
const MOUSE_BUTTONS = { ORBIT: MOUSE.LEFT, ZOOM: MOUSE.MIDDLE, PAN: MOUSE.RIGHT };
const KEYS = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
const EVENTS = { START: 'start', END: 'end', CHANGE: 'change' };

class TransitionStatus {
    public start: Vector2 = new Vector2();
    public end: Vector2 = new Vector2();
    public delta: Vector2 = new Vector2();
}

//
// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe
//
export class OrbitControls {
    private camera: any;
    private domElement;

    // "target" sets the location of focus, where the object orbits around
    private target: Vector3 = new Vector3();

    private options: OrbitControlsOptions = new OrbitControlsOptions();

    private state: number = STATE.NONE;

    // current position in spherical coordinates
    private spherical: any = new Spherical();
    private sphericalDelta: any = new Spherical();

    private scale: number = 1;
    private panOffset: Vector3 = new Vector3();
    private zoomChanged: boolean = false;

    private rotateStatus: TransitionStatus = new TransitionStatus();
    private panStatus: TransitionStatus = new TransitionStatus();
    private dollyStatus: TransitionStatus = new TransitionStatus();

    constructor(camera: PerspectiveCamera, domElement: HTMLCanvasElement) {
        this.camera = camera;
        this.domElement = ( domElement !== undefined ) ? domElement : document;

        this.initializeListeners();
    }

    private initializeListeners() {
        this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this), false);

        this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this), false);

        this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), false);

        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    public getPolarAngle() {
        return this.spherical.phi;
    };

    public getAzimuthalAngle() {
        return this.spherical.theta;
    };

    private dispatchEvent(event) {

    }

    // this method is exposed, but perhaps it would be better if we can make it private...
    public update() {
        var offset = new Vector3();

        // so camera.up is the orbit axis
        var quat = new Quaternion().setFromUnitVectors(this.camera.up, new Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();

        var lastPosition = new Vector3();
        var lastQuaternion = new Quaternion();

        var position = this.camera.position;

        offset.copy(position).sub(this.target);

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis
        this.spherical.setFromVector3(offset);

        if (this.options.autoRotate && this.state === STATE.NONE) {

            this.rotateLeft(this.getAutoRotationAngle());

        }

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;

        // restrict theta to be between desired limits
        this.spherical.theta = Math.max(this.options.minAzimuthAngle,
            Math.min(this.options.maxAzimuthAngle, this.spherical.theta));

        // restrict phi to be between desired limits
        this.spherical.phi = Math.max(this.options.minPolarAngle,
            Math.min(this.options.maxPolarAngle, this.spherical.phi));

        this.spherical.makeSafe();

        this.spherical.radius *= this.scale;

        // restrict radius to be between desired limits
        this.spherical.radius = Math.max(this.options.minDistance,
            Math.min(this.options.maxDistance, this.spherical.radius));

        // move target to panned location
        this.target.add(this.panOffset);

        offset.setFromSpherical(this.spherical);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(this.target).add(offset);

        this.camera.lookAt(this.target);

        if (this.options.enableDamping === true) {

            this.sphericalDelta.theta *= ( 1 - this.options.dampingFactor );
            this.sphericalDelta.phi *= ( 1 - this.options.dampingFactor );

        } else {

            this.sphericalDelta.set(0, 0, 0);

        }

        this.scale = 1;
        this.panOffset.set(0, 0, 0);

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (this.zoomChanged || lastPosition.distanceToSquared(this.camera.position) > EPS || 8 * ( 1
            - lastQuaternion.dot(this.camera.quaternion) ) > EPS) {

            this.dispatchEvent(EVENTS.CHANGE);

            lastPosition.copy(this.camera.position);
            lastQuaternion.copy(this.camera.quaternion);
            this.zoomChanged = false;

            return true;

        }

        return false;
    }

    public dispose() {
        this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
        this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
        this.domElement.removeEventListener('wheel', this.onMouseWheel, false);

        this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
        this.domElement.removeEventListener('touchend', this.onTouchEnd, false);
        this.domElement.removeEventListener('touchmove', this.onTouchMove, false);

        document.removeEventListener('mousemove', this.onMouseMove, false);
        document.removeEventListener('mouseup', this.onMouseUp, false);

        window.removeEventListener('keydown', this.onKeyDown, false);
    };

    private getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * this.options.autoRotateSpeed;
    }

    private getZoomScale() {
        return Math.pow(0.95, this.options.zoomSpeed);
    }

    private rotateLeft(angle) {
        this.sphericalDelta.theta -= angle;
    }

    private rotateUp(angle) {
        this.sphericalDelta.phi -= angle;
    }

    private panLeft(distance, objectMatrix) {
        let v = new Vector3();
        v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
        v.multiplyScalar(-distance);

        this.panOffset.add(v);
    };

    private panUp = function(distance, objectMatrix) {
        var v = new Vector3();
        v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
        v.multiplyScalar(distance);

        this.panOffset.add(v);

    };

    // deltaX and deltaY are in pixels; right and down are positive
    private pan(deltaX, deltaY) {
        var offset = new Vector3();
        var element = this.domElement === document ? this.domElement.body : this.domElement;

        // perspective
        var position = this.camera.position;
        offset.copy(position).sub(this.target);
        var targetDistance = offset.length();

        // half of the fov is center to top of screen
        targetDistance *= Math.tan(( this.camera.fov / 2 ) * Math.PI / 180.0);

        // we actually don't use screenWidth, since perspective camera is fixed to screen height
        this.panLeft(2 * deltaX * targetDistance / element.clientHeight, this.camera.matrix);
        this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.camera.matrix);
    }

    private dollyIn(dollyScale) {
        if (this.camera instanceof PerspectiveCamera) {

            this.scale /= dollyScale;

        } else if (this.camera instanceof OrthographicCamera) {

            this.camera.zoom = Math.max(this.options.minZoom,
                Math.min(this.options.maxZoom, this.camera.zoom * dollyScale));
            this.camera.updateProjectionMatrix();
            this.zoomChanged = true;

        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.options.enableZoom = false;
        }
    }

    private dollyOut(dollyScale) {
        this.scale *= dollyScale;
    }

    //
    // event callbacks - update the object state
    //

    private handleMouseDownRotate(event) {
        this.rotateStatus.start.set(event.clientX, event.clientY);
    }

    private handleMouseDownDolly(event) {
        this.dollyStatus.start.set(event.clientX, event.clientY);
    }

    private handleMouseDownPan(event) {
        this.panStatus.start.set(event.clientX, event.clientY);
    }

    private handleMouseMoveRotate(event) {
        this.rotateStatus.end.set(event.clientX, event.clientY);
        this.rotateStatus.delta.subVectors(this.rotateStatus.end, this.rotateStatus.start);

        var element = this.domElement === document ? this.domElement.body : this.domElement;

        // rotating across whole screen goes 360 degrees around
        this.rotateLeft(2 * Math.PI * this.rotateStatus.delta.x / element.clientWidth * this.options.rotateSpeed);

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp(2 * Math.PI * this.rotateStatus.delta.y / element.clientHeight * this.options.rotateSpeed);

        this.rotateStatus.start.copy(this.rotateStatus.end);

        this.update();
    }

    private handleMouseMoveDolly(event) {
        this.dollyStatus.end.set(event.clientX, event.clientY);
        this.dollyStatus.delta.subVectors(this.dollyStatus.end, this.dollyStatus.start);

        if (this.dollyStatus.delta.y > 0) {
            this.dollyIn(this.getZoomScale());
        } else if (this.dollyStatus.delta.y < 0) {
            this.dollyOut(this.getZoomScale());
        }

        this.dollyStatus.start.copy(this.dollyStatus.end);
        this.update();
    }

    private handleMouseMovePan(event) {
        this.panStatus.end.set(event.clientX, event.clientY);
        this.panStatus.delta.subVectors(this.panStatus.end, this.panStatus.start);

        this.pan(this.panStatus.delta.x, this.panStatus.delta.y);

        this.panStatus.start.copy(this.panStatus.end);

        this.update();
    }

    private handleMouseUp(event) {
    }

    private handleMouseWheel(event) {
        if (event.deltaY < 0) {
            this.dollyOut(this.getZoomScale());
        } else if (event.deltaY > 0) {
            this.dollyIn(this.getZoomScale());
        }

        this.update();
    }

    private handleKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.UP:
                this.pan(0, this.options.keyPanSpeed);
                this.update();
                break;

            case KEYS.BOTTOM:
                this.pan(0, -this.options.keyPanSpeed);
                this.update();
                break;

            case KEYS.LEFT:
                this.pan(this.options.keyPanSpeed, 0);
                this.update();
                break;

            case KEYS.RIGHT:
                this.pan(-this.options.keyPanSpeed, 0);
                this.update();
                break;
        }
    }

    private handleTouchStartRotate(event) {
        this.rotateStatus.start.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    private handleTouchStartDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;

        var distance = Math.sqrt(dx * dx + dy * dy);

        this.dollyStatus.start.set(0, distance);
    }

    private handleTouchStartPan(event) {
        this.panStatus.start.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    private handleTouchMoveRotate(event) {
        this.rotateStatus.end.set(event.touches[0].pageX, event.touches[0].pageY);
        this.rotateStatus.delta.subVectors(this.rotateStatus.end, this.rotateStatus.start);

        var element = this.domElement === document ? this.domElement.body : this.domElement;

        // rotating across whole screen goes 360 degrees around
        this.rotateLeft(2 * Math.PI * this.rotateStatus.delta.x / element.clientWidth * this.options.rotateSpeed);

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp(2 * Math.PI * this.rotateStatus.delta.y / element.clientHeight * this.options.rotateSpeed);

        this.rotateStatus.start.copy(this.rotateStatus.end);

        this.update();
    }

    private handleTouchMoveDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;

        var distance = Math.sqrt(dx * dx + dy * dy);

        this.dollyStatus.end.set(0, distance);

        this.dollyStatus.delta.subVectors(this.dollyStatus.end, this.dollyStatus.start);

        if (this.dollyStatus.delta.y > 0) {
            this.dollyOut(this.getZoomScale());
        } else if (this.dollyStatus.delta.y < 0) {
            this.dollyIn(this.getZoomScale());
        }

        this.dollyStatus.start.copy(this.dollyStatus.end);

        this.update();
    }

    private handleTouchMovePan(event) {
        this.panStatus.end.set(event.touches[0].pageX, event.touches[0].pageY);
        this.panStatus.delta.subVectors(this.panStatus.end, this.panStatus.start);

        this.pan(this.panStatus.delta.x, this.panStatus.delta.y);

        this.panStatus.start.copy(this.panStatus.end);

        this.update();
    }

    private handleTouchEnd(event) {
    }

    //
    // event handlers - FSM: listen for events and reset state
    //

    private onMouseDown(event) {
        if (this.options.enabled === false) {
            return;
        }

        event.preventDefault();

        if (event.button === MOUSE_BUTTONS.ORBIT) {

            if (this.options.enableRotate === false) {
                return;
            }

            this.handleMouseDownRotate(event);

            this.state = STATE.ROTATE;
        } else if (event.button === MOUSE_BUTTONS.ZOOM) {

            if (this.options.enableZoom === false) {
                return;
            }

            this.handleMouseDownDolly(event);

            this.state = STATE.DOLLY;
        } else if (event.button === MOUSE_BUTTONS.PAN) {

            if (this.options.enablePan === false) {
                return;
            }

            this.handleMouseDownPan(event);

            this.state = STATE.PAN;
        }

        if (this.state !== STATE.NONE) {
            document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
            document.addEventListener('mouseup', this.onMouseUp.bind(this), false);

            this.dispatchEvent(EVENTS.START);
        }
    }

    private onMouseMove(event) {
        if (this.options.enabled === false) {
            return;
        }

        event.preventDefault();

        if (this.state === STATE.ROTATE) {

            if (this.options.enableRotate === false) {
                return;
            }

            this.handleMouseMoveRotate(event);

        } else if (this.state === STATE.DOLLY) {

            if (this.options.enableZoom === false) {
                return;
            }

            this.handleMouseMoveDolly(event);

        } else if (this.state === STATE.PAN) {

            if (this.options.enablePan === false) {
                return;
            }

            this.handleMouseMovePan(event);
        }

    }

    private onMouseUp(event) {
        if (this.options.enabled === false) {
            return;
        }

        this.handleMouseUp(event);

        document.removeEventListener('mousemove', this.onMouseMove, false);
        document.removeEventListener('mouseup', this.onMouseUp, false);

        this.dispatchEvent(EVENTS.END);

        this.state = STATE.NONE;
    }

    private onMouseWheel(event) {
        if (this.options.enabled === false || this.options.enableZoom === false || ( this.state !== STATE.NONE
            && this.state !== STATE.ROTATE )) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.handleMouseWheel(event);

        this.dispatchEvent(EVENTS.START); // not sure why these are here...
        this.dispatchEvent(EVENTS.END);
    }

    private onKeyDown(event) {
        if (this.options.enabled === false || this.options.enableKeys === false || this.options.enablePan === false) {
            return;
        }

        this.handleKeyDown(event);
    }

    private onTouchStart(event) {
        if (this.options.enabled === false) {
            return;
        }

        switch (event.touches.length) {

            case 1:	// one-fingered touch: rotate

                if (this.options.enableRotate === false) {
                    return;
                }

                this.handleTouchStartRotate(event);

                this.state = STATE.TOUCH_ROTATE;

                break;

            case 2:	// two-fingered touch: dolly

                if (this.options.enableZoom === false) {
                    return;
                }

                this.handleTouchStartDolly(event);

                this.state = STATE.TOUCH_DOLLY;

                break;

            case 3: // three-fingered touch: pan

                if (this.options.enablePan === false) {
                    return;
                }

                this.handleTouchStartPan(event);

                this.state = STATE.TOUCH_PAN;

                break;

            default:
                this.state = STATE.NONE;
        }

        if (this.state !== STATE.NONE) {
            this.dispatchEvent(EVENTS.START);
        }
    }

    private onTouchMove(event) {
        if (this.options.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                if (this.options.enableRotate === false) {
                    return;
                }
                if (this.state !== STATE.TOUCH_ROTATE) {
                    return;
                } // is this needed?...

                this.handleTouchMoveRotate(event);

                break;

            case 2: // two-fingered touch: dolly

                if (this.options.enableZoom === false) {
                    return;
                }
                if (this.state !== STATE.TOUCH_DOLLY) {
                    return;
                } // is this needed?...

                this.handleTouchMoveDolly(event);

                break;

            case 3: // three-fingered touch: pan

                if (this.options.enablePan === false) {
                    return;
                }
                if (this.state !== STATE.TOUCH_PAN) {
                    return;
                } // is this needed?...

                this.handleTouchMovePan(event);

                break;

            default:

                this.state = STATE.NONE;

        }
    }

    private onTouchEnd(event) {
        if (this.options.enabled === false) {
            return;
        }

        this.handleTouchEnd(event);

        this.dispatchEvent(EVENTS.END);

        this.state = STATE.NONE;
    }

    private onContextMenu(event) {
        event.preventDefault();
    }

}