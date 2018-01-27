import path from 'path';
import chalk from 'chalk';
import co from 'co';
import npminstall from 'npminstall';

// 插件存放目录
// const pluginsDir = path.join(os.homedir(), '.aimake', 'plugins');
const pluginsDir = path.join(__dirname, '../../../');

export default {
  command: 'install <plugins...>',
  // 定义命令选项
  options: [
    ['-r, --registry <registry>', 'change npm registry'],
  ],
  run(argument, options) {
    const plugins = argument;

    if (process.getuid && process.getuid() === 0) {
      console.log('Please DO NOT run aimake install as root!');
      console.log('You can run "sudo chmod 777 `npm root -g`" to have write permission.');
      process.exit();
    }
    // 配置
    const config = {
      root: process.cwd(),
      pkgs: plugins.map(plugin => ({
        name: `aimake-plugin-${plugin}`,
        version: 'latest'
      })),
      registry: 'http://registry.npmjs.com',
      targetDir: pluginsDir
    };

    if (options.registry) {
      config.registry = options.registry;
      if (process.platform === 'darwin') {
        process.env.npm_config_fse_binary_host_mirror = 'http://127.0.0.1';
      }
    }

    const pluginStr = config.pkgs.map(pkg => pkg.name).join(' ');

    console.log(`开始安装 ${chalk.yellow(pluginStr)} ...`);

    // 开始安装
    co(function* install() {
      yield npminstall(config);
    }).catch((err) => {
      console.log(err.stack);
    });
  }
};
