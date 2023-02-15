const { SpawnHelper, DockerodeHelper } = require("@gluestack/helpers");
const { fileExists } = require("@gluestack/helpers");

import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController, { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import { readdir } from 'node:fs/promises';
import { join } from 'node:path'
import { Dirent } from "node:fs";

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: PluginInstance;

  constructor(app: IApp, callerInstance: PluginInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): PluginInstance {
    return this.callerInstance;
  }

  installScript() {
    return ["npm", "install"];
  }

  buildScript() {
    return ["npm", "run", "build"];
  }

  runScript() {
    // do nothing
  }

  async getEnv() {
    return {
      APP_PORT: await this.getPortNumber(),
    };
  }

  getDockerJson() {
    return {};
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  //@ts-ignore
  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      DockerodeHelper.getPort(9000, ports)
        .then((port: number) => {
          this.setPortNumber(port);
          ports.push(port);
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
          return resolve(this.portNumber);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    return (this.status = status || "down");
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    return (this.portNumber = portNumber || null);
  }

  setContainerId(containerId: string) {
    //
  }

  getConfig(): any { }

  async up() {
    //
  }

  async down() {
    //
  }

  async build() {
    await SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript());
    await SpawnHelper.run(this.callerInstance.getInstallationPath(), this.buildScript());
  }

  async getRoutes(): Promise<IRoutes[]> {
    const routes: IRoutes[] = [];

    const path: string = join(
      process.cwd(),
      await this.callerInstance.getInstallationPath()
    );

    const functionsPath: string = join(path, 'functions');
    if (!await fileExists(functionsPath)) {
      return routes;
    }

    const dirents: Dirent[] = await readdir(functionsPath, {
      withFileTypes: true
    });

    for await (const dirent of dirents) {
      if (dirent.isDirectory()) {
        routes.push({
          method: "POST",
          path: dirent.name
        });

        routes.push({
          method: "GET",
          path: dirent.name
        });

        routes.push({
          method: "PUT",
          path: dirent.name
        });

        routes.push({
          method: "DELETE",
          path: dirent.name
        });
      }
    }

    return Promise.resolve(routes);
  }
}
