import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 1600}) # Tall for full page

        async def capture_page(url, filename):
            print(f"Capturing {url}...")
            await page.goto(url)
            # Wait for loading screen to disappear (2s timer in App.tsx)
            await asyncio.sleep(5)
            await page.screenshot(path=filename, full_page=True)
            print(f"Saved {filename}")

        # Home
        await capture_page('http://localhost:5173/', 'v_home.png')

        # Lab (Sorting)
        await capture_page('http://localhost:5173/sorting', 'v_lab.png')

        # Searching
        await capture_page('http://localhost:5173/searching', 'v_search.png')

        # Quantum
        await capture_page('http://localhost:5173/quantum', 'v_quantum.png')

        # About
        await capture_page('http://localhost:5173/about', 'v_about.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
