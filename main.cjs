'use strict';

const electron = require('electron');
import('./main.js').then((m) => m.load(electron));