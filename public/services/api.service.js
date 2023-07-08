"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLyrics = exports.findLyrics = exports.searchYouTube = exports.search = exports.getMusicByUserId = void 0;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const getMusicByUserId = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.vk.com/method/audio.get`;
    try {
        return yield axios_1.default.get(url, {
            params: {
                access_token: process.env.KATE_TOKEN,
                owner_id: userID,
                v: '5.131',
            },
            headers: {
                'User-Agent': process.env.KATE_USER_AGENT,
            }
        });
    }
    catch (error) {
        console.error(error);
        throw new Error('search api error');
    }
});
exports.getMusicByUserId = getMusicByUserId;
const search = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.vk.com/method/audio.search`;
    try {
        return yield axios_1.default.get(url, {
            params: {
                q: request,
                count: 3,
                auto_complete: 1,
                sort: 2,
                offset: 5,
                access_token: process.env.KATE_TOKEN,
                v: '5.131',
            },
            headers: {
                'User-Agent': process.env.KATE_USER_AGENT,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw new Error('search api error');
    }
});
exports.search = search;
const searchYouTube = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://www.googleapis.com/youtube/v3/search';
    try {
        return yield axios_1.default.get(url, {
            params: {
                q: request,
                part: 'snippet',
                type: 'video',
                maxResults: 10,
                key: process.env.YOUTUBE_TOKEN,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw new Error('youtube api error');
    }
});
exports.searchYouTube = searchYouTube;
const findLyrics = (trackId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'http://api.musixmatch.com/ws/1.1/';
    const apiKey = process.env.MUSIXMATCH_TOKEN;
    return yield axios_1.default.get(url + `track.lyrics.get`, {
        params: {
            track_id: trackId,
            apikey: apiKey,
        }
    });
});
exports.findLyrics = findLyrics;
const getLyrics = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'http://api.musixmatch.com/ws/1.1/';
    const apiKey = process.env.MUSIXMATCH_TOKEN;
    try {
        const response = yield axios_1.default.get(url + 'track.search', {
            params: {
                q: request,
                apikey: apiKey,
            }
        });
        const data = yield response.data;
        if (data['message']['header'].status_code !== 200) {
            return undefined;
        }
        const trackId = data['message']['body']['track_list'][0]['track']['track_id'];
        const result = yield (0, exports.findLyrics)(trackId);
        const lyrics = result.data['message']['body']['lyrics']['lyrics_body'];
        return lyrics;
    }
    catch (error) {
        console.error(error);
        throw new Error('lyrics api error');
    }
});
exports.getLyrics = getLyrics;
//# sourceMappingURL=api.service.js.map