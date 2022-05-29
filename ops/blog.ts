import { promises as fs } from "fs";
import { parse as parseDate, format as formatDate } from "date-fns";
import * as path from "path";
import * as yargs from "yargs";
import YAML from "yaml";
import crypto from "crypto";

function genSlug(): string {
  return crypto.randomBytes(8).toString("hex");
}

function tryAssign<T>(m: { [key: string]: any }, key: string, value: T) {
  if (value != undefined) {
    m[key] = value;
  }
}

async function create(
  slug: string,
  date: Date,
  title: string,
  tags: string[],
  keywords: string[],
  description: string,
  image: string
): Promise<void> {
  const postDate = date ? formatDate(date, "yyyy-MM-dd") : "draft";
  const postSlug = slug || genSlug();
  const postDraft = !date;

  const postName = `${postDate}-${postSlug}`;
  const dir = path.join("blog", postName);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, "index.md");

  const matter: { [key: string]: any } = {
    authors: ["kyoh86"],
    title: title,
    draft: postDraft,
    tags: tags,
  };
  tryAssign(matter, "keywords", keywords);
  tryAssign(matter, "description", description);
  tryAssign(matter, "image", image);

  const fd = await fs.open(file, "w");
  await fd.truncate(0);
  await fd.write("---\n\n");
  await fd.write(YAML.stringify(matter));
  await fd.write("\n---\n\n");
  await fd.write("## ");
}

async function main() {
  await yargs
    .scriptName("blog.ts")
    .command(
      "new",
      "make a new post",
      (yargs) => {
        return yargs
          .option("date", {
            description: "publish date of the post",
            string: true,
          })
          .option("slug", {
            description: "unique id of the post",
            string: true,
          })
          .option("title", {
            description: "title of the post",
            string: true,
            default: "",
          })
          .option("tag", {
            description: "tags of the post",
            string: true,
            array: true,
            default: [],
          })
          .option("keyword", {
            description: "keywords of the post",
            string: true,
            array: true,
          })
          .option("description", {
            description: "description of the post",
            string: true,
          })
          .option("image", {
            description: "image of the post",
            string: true,
          })
          .coerce({
            date: (s) => {
              return parseDate(s, "yyyy-MM-dd", new Date());
            },
          });
      },
      (argv) => {
        create(
          argv.slug,
          argv.date,
          argv.title,
          argv.tag,
          argv.keyword,
          argv.description,
          argv.image
        );
      }
    )
    .demandCommand(1, "You need at least one command before moving on")
    .strict()
    .help("help").argv;
}

main();
