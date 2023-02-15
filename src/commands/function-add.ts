const prompts = require("prompts");
const services = require("@gluestack/framework/constants/services");
const { writeFile } = require("@gluestack/helpers");
const { createFolder } = require("@gluestack/helpers");

import { GlueStackPlugin } from "..";
import { PluginInstance } from "../PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

import { join } from "node:path";

import { functionContent } from "../helpers/function-content";
import { replaceRouteName } from "../helpers/replace-route-name";

export function functionsAdd(program: any, glueStackPlugin: GlueStackPlugin) {
  program
    .command("function:add")
    .description("Adds an express action (handler) to the project")
    .argument(
      '<function-name>',
      'name of the function to be added'
    )
    .action(async (functionName: string) => handler(glueStackPlugin, functionName));
}

const selectPluginName = async (services: string[]) => {
  const choices = services.map((service: string) => {
    return {
      title: service,
      description: `Select a language for your service`,
      value: service,
    };
  });

  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select a service plugin",
    choices: choices,
  });

  return value;
};

const writeAction = async (pluginInstance: PluginInstance, functionName: string) => {
  const directory: string = join(pluginInstance.getInstallationPath(), 'functions', replaceRouteName(functionName));

  await createFolder(directory);

  await writeFile(
    `${directory}/handler.js`,
    functionContent
  );
};

const selectInstance = async (pluginInstances: IInstance[]) => {
  const choices = pluginInstances.map((instance: PluginInstance) => {
    return {
      title: instance.getName(),
      description: `Select ${instance.getName()} instance`,
      value: instance,
    };
  });
  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select an instance",
    choices: choices,
  });

  return value;
};

const handler = async (glueStackPlugin: GlueStackPlugin, actionName: string) => {
  const pluginName = await selectPluginName(services);
  if (!pluginName) {
    console.log("No plugin selected");
    return;
  }

  const plugin = glueStackPlugin.app.getPluginByName(pluginName);
  if (plugin && plugin.getInstances().length) {
    const instance = await selectInstance(plugin.getInstances());
    if (instance) {
      await writeAction(instance, actionName);
    }
  } else {
    console.error("No service instances found");
  }
};
