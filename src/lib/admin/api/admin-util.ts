"use strict";

import {NotFoundError, DuplicatedError} from "../../service/api";
import {Errors} from "typescript-rest";
import {AdminServer} from "../admin-server";

export abstract class RestController {
    private _service:any;

    get service() {
        if (!this._service) {
            this.init();
        }

        return this._service;
    }

    private init() {
        this._service = new this.serviceClass(AdminServer.gateway.redisClient);
    }

    abstract get serviceClass();

    handleError(err: Error) {
        if (err instanceof NotFoundError) {
            return new Errors.NotFoundError(err.message);
        } else if (err instanceof DuplicatedError) {
            return new Errors.ConflictError(err.message);
        } else if(err instanceof Errors.ForbidenError) {
            return err;
        } else {
            return new Errors.InternalServerError(err.message);
        }
    }
}