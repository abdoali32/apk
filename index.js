/**
 * @format
 *
 * هنا بنسجل التطبيق عشان يشتغل على الموبايل
 * لو عايز تغير اسم التطبيق، غيره في app.json
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);