import chalk from "chalk"
import { development } from "./env"

const logColors = {
  "default": chalk.reset,
  "blue": chalk.blue,
  "cyan": chalk.cyan,
  "green": chalk.green,
  "yellow": chalk.yellowBright,
  "grey": chalk.gray,
}

type LoggerColors = keyof typeof logColors

export function logger(prefix: string, color?: LoggerColors) {
  // console.log(chalk.black("Black"))
  // console.log(chalk.blackBright("Black Bright"))
  // console.log(chalk.blue("Blue"))
  // console.log(chalk.blueBright("Blue Bright"))
  // console.log(chalk.cyan("Cyan"))
  // console.log(chalk.cyanBright("Cyan Bright"))
  // console.log(chalk.gray("Gray"))
  // console.log(chalk.green("Green"))
  // console.log(chalk.greenBright("Green Bright"))
  // console.log(chalk.magenta("Magenta"))
  // console.log(chalk.magentaBright("Magenta Bright"))
  // console.log(chalk.red("Red"))
  // console.log(chalk.redBright("Red Bright"))
  // console.log(chalk.white("White"))
  // console.log(chalk.whiteBright("White Bright"))
  // console.log(chalk.yellow("Yellow"))
  // console.log(chalk.yellowBright("Yellow Bright"))
  return (o: any) => {
    if(development)
    console.log(logColors[color ?? "blue"](prefix) + o)
  }
}