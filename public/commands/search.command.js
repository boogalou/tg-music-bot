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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCommand = void 0;
const filters_1 = require("telegraf/filters");
const telegraf_1 = require("telegraf");
const command_class_1 = require("./command.class");
const api_service_1 = require("../services/api.service");
const normalize_response_1 = require("../utils/normalize-response");
const list_formatting_1 = require("../utils/list-formatting");
class SearchCommand extends command_class_1.Command {
    constructor(bot, logger) {
        super(bot);
        this.logger = logger;
        this.state = {
            tracks: [],
            searchRequest: '',
            selectedTrackIndex: -1,
        };
    }
    handle() {
        try {
            this.bot.command('find', (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield ctx.reply('Enter your request');
                yield this.bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(this, void 0, void 0, function* () {
                    const searchRequest = ctx.message.text;
                    this.state.searchRequest = ctx.message.text;
                    const searchResponse = yield (0, api_service_1.search)(searchRequest);
                    const items = searchResponse.data.response.items;
                    if (items.length <= 0) {
                        yield ctx.replyWithHTML('<pre>No results found</pre>');
                        return;
                    }
                    this.state.tracks = (0, normalize_response_1.normalizeResponse)(items);
                    const trackList = (0, list_formatting_1.listFormatting)(this.state.tracks);
                    const inlineMessageRatingKeyboard = [];
                    for (let i = 0; i < this.state.tracks.length; i++) {
                        inlineMessageRatingKeyboard.push(telegraf_1.Markup.button.callback(`${i + 1}`, `${i}`));
                    }
                    const replyOptions = telegraf_1.Markup.inlineKeyboard(inlineMessageRatingKeyboard);
                    yield ctx.replyWithHTML(trackList, replyOptions);
                    yield this.bot.action(inlineMessageRatingKeyboard.map((_, index) => String(index)), (ctx) => __awaiter(this, void 0, void 0, function* () {
                        const trackIndex = Number(ctx.match.at(0));
                        this.state.selectedTrackIndex = trackIndex;
                        yield ctx.replyWithAudio(this.state.tracks[this.state.selectedTrackIndex], telegraf_1.Markup.inlineKeyboard([
                            telegraf_1.Markup.button.callback('YouTube', `YouTube-${this.state.selectedTrackIndex}`),
                            telegraf_1.Markup.button.callback('Song Lyrics', `Lyrics-${this.state.selectedTrackIndex}`),
                        ]));
                        this.bot.action(`YouTube-${this.state.selectedTrackIndex}`, (ctx) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            const selectedTrackIndex = (_a = ctx.match.at(0)) === null || _a === void 0 ? void 0 : _a.split('-').at(1);
                            const response = yield (0, api_service_1.searchYouTube)(this.state.tracks[+selectedTrackIndex].filename);
                            const videoId = yield response.data.items[0]['id']['videoId'];
                            if (!videoId) {
                                yield ctx.replyWithHTML('<pre>404 video not found</pre>');
                                return;
                            }
                            yield ctx.reply('https://www.youtube.com/watch?v=' + videoId);
                        }));
                        this.bot.action(`Lyrics-${this.state.selectedTrackIndex}`, (ctx) => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            const selectedTrackIndex = (_b = ctx.match.at(0)) === null || _b === void 0 ? void 0 : _b.split('-').at(1);
                            const lyrics = yield (0, api_service_1.getLyrics)(this.state.tracks[+selectedTrackIndex].filename);
                            if (!lyrics) {
                                yield ctx.replyWithHTML('<pre>404 text not found</pre>');
                                return;
                            }
                            yield ctx.replyWithHTML(`<pre>${lyrics}</pre>`);
                        }));
                    }));
                }));
            }));
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    ;
}
exports.SearchCommand = SearchCommand;
;
//# sourceMappingURL=search.command.js.map