const prompts = require("prompts");
const services = require("@gluestack/framework/constants/services");

const { removeSpecialChars } = require("@gluestack/helpers");
const { getDirectories } = require("@gluestack/helpers");
const { fileExists } = require("@gluestack/helpers");

import { GlueStackPlugin } from "..";
import { PluginInstance } from "../PluginInstance";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

import { relative, join } from "node:path";
import { reWriteFile } from "../helpers/rewrite-file";
import { copyToTarget } from "../helpers/copy-to-target";

import { renameDirectory } from "../helpers/rename-directory";

export const functionsAttachAction = (program: any, glueStackPlugin: GlueStackPlugin) => {
  program
    .command("function:attach-action")
    .description("Adds a graphql action against the function")
    .action(async () => handler(glueStackPlugin));
};

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

const selectFunction = async (functions: string[]) => {
  const choices = functions.map((_function: string) => {
    return {
      title: _function,
      value: _function
    };
  });

  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select a function",
    choices: choices,
  });

  return value;
};

const writeAction = async (pluginInstance: PluginInstance) => {
  const functionsPath: string = join(
    process.cwd(),
    pluginInstance.getInstallationPath(),
    'functions'
  );

  if (!await fileExists(functionsPath)) {
    console.log(`No functions found in ${relative('.', functionsPath)}. Please add one and try again!`);
    return;
  }

  const directories: string[] = await getDirectories(functionsPath);
  if (!directories.length) {
    console.log(`No functions found in ${relative('.', functionsPath)}. Please add one and try again!`);
    return;
  }

  let functionName: string = await selectFunction(directories);
  if (functionName) {
    const oldName: string = functionName;
    functionName = oldName.replaceAll('-', '').replaceAll('_', '');

    await renameDirectory(functionsPath + '/' + oldName, functionsPath + '/' + functionName);
  }

  const functionPath: string = join(functionsPath, functionName);
  if (!await fileExists(functionPath + '/handler.js')) {
    console.log(`Missing "handler.js" file in "${relative('.', functionPath)}". Please add one and try again!`);
    return;
  }

  await copyToTarget(
    pluginInstance.callerPlugin.getActionTemplateFolderPath(),
    functionPath
  );

  const actionGQLfile = `${functionPath}/action.graphql`;
  await reWriteFile(actionGQLfile, removeSpecialChars(functionName), 'actionName');
};

export async function handler(glueStackPlugin: GlueStackPlugin) {
  const pluginName = await selectPluginName(services);
  if (!pluginName) {
    console.log("No plugin selected");
    return;
  }

  const plugin = glueStackPlugin.app.getPluginByName(pluginName);
  if (plugin && plugin.getInstances().length) {
    const instance = await selectInstance(glueStackPlugin.getInstances());
    if (instance) {
      await writeAction(instance);
    }
  } else {
    console.log("No service instances found");
  }
}
