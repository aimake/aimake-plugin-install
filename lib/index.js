'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _npminstall = require('npminstall');

var _npminstall2 = _interopRequireDefault(_npminstall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 插件存放目录
// const pluginsDir = path.join(os.homedir(), '.aimake', 'plugins');
var pluginsDir = _path2.default.join(__dirname, '../../../');

exports.default = {
  command: 'install <plugins...>',
  // 定义命令选项
  options: [['-r, --registry <registry>', 'change npm registry']],
  run: function run(argument, options) {
    var plugins = argument;

    if (process.getuid && process.getuid() === 0) {
      console.log('Please DO NOT run aimake install as root!');
      console.log('You can run "sudo chmod 777 `npm root -g`" to have write permission.');
      process.exit();
    }
    // 配置
    var config = {
      root: process.cwd(),
      pkgs: plugins.map(function (plugin) {
        return {
          name: 'aimake-plugin-' + plugin,
          version: 'latest'
        };
      }),
      registry: 'http://registry.npmjs.com',
      targetDir: pluginsDir
    };

    if (options.registry) {
      config.registry = options.registry;
      if (process.platform === 'darwin') {
        process.env.npm_config_fse_binary_host_mirror = 'http://127.0.0.1';
      }
    }

    var pluginStr = config.pkgs.map(function (pkg) {
      return pkg.name;
    }).join(' ');

    console.log('Start installing ' + _chalk2.default.yellow(pluginStr) + ' ...');

    // 开始安装
    (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function install() {
      return _regenerator2.default.wrap(function install$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _npminstall2.default)(config);

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, install, this);
    })).catch(function (err) {
      console.log(err.stack);
    });
  }
};