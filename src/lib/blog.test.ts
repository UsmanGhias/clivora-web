import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "./blog";

const BANNED = [
  "delve", "testament to", "beacon", "seamless", "empower", "unlock", "revolutioni",
  "bespoke", "robust", "state-of-the-art", "game-changer", "cutting-edge",
];

describe("blog content", () => {
  const posts = getAllPosts();

  it("publishes at least the four editorial articles", () => {
    expect(posts.length).toBeGreaterThanOrEqual(4);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s has complete metadata", (_slug, post) => {
    expect(post.title.length).toBeGreaterThan(10);
    expect(post.description.length).toBeGreaterThan(50);
    expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(post.keywords.length).toBeGreaterThan(0);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s is long-form (1,500+ words)", (_slug, post) => {
    expect(post.wordCount).toBeGreaterThanOrEqual(1500);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s follows the house style", (_slug, post) => {
    const text = `${post.title}\n${post.description}\n${post.content}`;
    expect(text).not.toContain("—");
    for (const word of BANNED) expect(text.toLowerCase()).not.toContain(word);
  });

  it("rejects unsafe slugs", () => {
    expect(getPostBySlug("../package")).toBeNull();
  });
});
