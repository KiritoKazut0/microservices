import {  Injectable } from "@nestjs/common";
import ScrapedService from "../../application/service/scrapperService";
import { ContentBlock } from "../../domain/objectValue/ContentBlock";
import { InjectBrowser } from "nestjs-puppeteer";
import { Browser } from "puppeteer";

@Injectable()
export class PuppeteerScrappedService implements ScrapedService {

    constructor(
        @InjectBrowser()
        private readonly browser: Browser
    ) {}

    async scraped(url: string) {
        try {
            
        const page = await this.browser.newPage();

        await page.goto(url, { waitUntil: "domcontentloaded" });

        const result = await page.evaluate(() => {
            let main = document.querySelector("main");
            if (!main) main = document.body;

            const title =
                (main.querySelector("h1") as HTMLElement)?.innerText.trim() ||
                document.title ||
                "";

            const subtitle =
                (main.querySelector("h2") as HTMLElement)?.innerText.trim() || "";

            const dependency =
                (main.querySelector("section.small p") as HTMLElement)
                    ?.innerText.split("|")[0]?.trim() || "";

            const date =
                (main.querySelector("section.small p") as HTMLElement)
                    ?.innerText.split("|")[1]?.trim() || "";

            const image =
                (main.querySelector("img.img_curve") as HTMLImageElement)?.src || "";

            const bulletNodes = main.querySelectorAll("div[style*='margin-left']");
            const bullets = [...bulletNodes]
                .map((el: any) => el.innerText.trim().replace(/^●\s*/, ""))
                .filter((t) => t.length > 5);

            const paragraphNodes = main.querySelectorAll(".article-body p");
            const paragraphs = [...paragraphNodes]
                .map((el: any) => el.innerText.trim())
                .filter(
                    (t) =>
                        t.length > 5 &&
                        t !== "—000—" &&
                        !t.includes("La legalidad, veracidad")
                );

            const content: any[] = [];

            bullets.forEach((b) => content.push({ type: "p", text: b }));
            paragraphs.forEach((p) => content.push({ type: "p", text: p }));

            return {
                title,
                subtitle,
                dependency,
                date,
                document_type: "Comunicado",
                image_url: image,
                content
            };
        });

        await page.close();

        const contentBlocks = result.content.map(
            (c: any) => new ContentBlock(c.type, c.text)
        );

        return {
            title: result.title,
            subtitle: result.subtitle,
            date_publish_text: result.date,
            document_type: result.document_type,
            content: contentBlocks
        };
        } catch (error) {
            console.log(error)
            throw(error)
            
        }
    }
}
