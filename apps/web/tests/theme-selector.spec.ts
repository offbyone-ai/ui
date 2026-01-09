import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:4322";

const themes = [
	{ value: "default", label: "Default" },
	{ value: "forest", label: "Forest" },
	{ value: "ocean", label: "Ocean" },
	{ value: "sunset", label: "Sunset" },
	{ value: "lavender", label: "Lavender" },
	{ value: "rose", label: "Rose" },
];

test.describe("Theme selector preview", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(`${BASE}/components/theme-selector`);
		await page.waitForLoadState("networkidle");
		// Force a color mode for the test to ensure previews don't change it
		await page.evaluate(() => document.documentElement.classList.add('dark'));
		const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
		expect(hasDark).toBe(true);
	});

	test("previews themes on hover", async ({ page }) => {
		// Open the selector dropdown (try a few selectors to be robust)
		async function findToggle() {
			const s1 = page.locator('button:has-text("Default")').first();
			if ((await s1.count()) > 0) return s1;
			const s2 = page.locator('button:has-text("Theme")').first();
			if ((await s2.count()) > 0) return s2;
			return page.locator('div.w-64 button').first();
		}

		const toggle = await findToggle();
		await toggle.waitFor({ state: 'visible', timeout: 10_000 });

		// Verify default dark mode visuals are valid (no invalid/nulled colors, radius present)
		const toggleBounding = await toggle.boundingBox();
		expect(toggleBounding).not.toBeNull();

		const docBgBefore = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
		// Dark mode background should not be white
		expect(docBgBefore).not.toBe('rgb(255, 255, 255)');

		const bgBefore = await page.evaluate((el) => getComputedStyle(el).backgroundColor, await toggle.elementHandle());
		expect(bgBefore).toBeTruthy();

		const radiusBefore = await page.evaluate((el) => getComputedStyle(el).borderRadius, await toggle.elementHandle());
		expect(radiusBefore).not.toBe('0px');

		await toggle.click();

		for (const t of themes) {
			const opt = page.locator(`button:has-text("${t.label}")`).first();
			await opt.waitFor({ state: 'visible', timeout: 5_000 });
			await opt.hover();
			await page.waitForTimeout(250);

			const dataTheme = await page.evaluate(() =>
				document.documentElement.getAttribute("data-theme")
			);
			const expected = t.value === "default" ? null : t.value;
			expect(dataTheme).toBe(expected);

			// Ensure the color mode didn't change while previewing
			const stillDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
			expect(stillDark).toBe(true);

			// Make sure background/border radius stay valid after preview applies
			const bg = await page.evaluate((el) => getComputedStyle(el).backgroundColor, await toggle.elementHandle());
			expect(bg).toBeTruthy();
			const radius = await page.evaluate((el) => getComputedStyle(el).borderRadius, await toggle.elementHandle());
			expect(radius).not.toBe('0px');

			await page.screenshot({ path: `tests/screenshots/theme-${t.value}.png` });
		}
	});
});
