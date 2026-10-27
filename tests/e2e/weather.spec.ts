import { expect, type Page, test } from '@playwright/test';

const geocodingResponse = {
  results: [
    {
      id: 2267057,
      name: 'Lisboa',
      latitude: 38.7167,
      longitude: -9.1333,
      country: 'Portugal',
      country_code: 'PT',
      admin1: 'Lisboa',
      timezone: 'Europe/Lisbon',
    },
  ],
};

const forecastResponse = {
  timezone: 'Europe/Lisbon',
  current: {
    temperature_2m: 18.4,
    weather_code: 2,
    relative_humidity_2m: 72,
    wind_speed_10m: 12.5,
    precipitation: 0.2,
    surface_pressure: 1013.2,
  },
  daily: {
    time: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'],
    temperature_2m_max: [20.1, 21.3, 19.8, 17.6, 18.9],
    temperature_2m_min: [13.2, 14.1, 12.8, 11.6, 12.4],
    precipitation_probability_max: [10, 5, 20, 70, 15],
    weather_code: [2, 1, 3, 61, 2],
  },
};

async function mockWeatherApi(page: Page, geocodingPayload: unknown = geocodingResponse) {
  let forecastRequestCount = 0;

  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(geocodingPayload),
    });
  });
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequestCount += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(forecastResponse),
    });
  });

  return () => forecastRequestCount;
}

test('searches a city, displays its five-day forecast, and converts to Fahrenheit', async ({
  page,
}) => {
  await mockWeatherApi(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Lisboa');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Lisboa' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(5);

  await page.getByRole('button', { name: 'Fahrenheit' }).click();

  const currentWeather = page.getByRole('region', { name: 'Lisboa' });
  await expect(currentWeather.getByText('65', { exact: true })).toBeVisible();
  await expect(currentWeather.getByText('°F', { exact: true })).toBeVisible();
});

test('shows an empty state when geocoding returns no results', async ({ page }) => {
  const getForecastRequestCount = await mockWeatherApi(page, {});

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  expect(getForecastRequestCount()).toBe(0);
});

test('searches and renders weather at a 375x812 mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockWeatherApi(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Lisboa');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Lisboa' })).toBeVisible();
  await expect(page.getByText('Parcialmente nublado')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(5);
});
