const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlcontroller");
const validateUrl = require("../middleware/validateUrl");

/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: API for managing URLs
 */

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullUrl:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Short URL created successfully
 */
router.post("/shorten", validateUrl, urlController.createShortUrl);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get all shortened URLs with pagination
 *     tags: [URLs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of URLs
 */
router.get("/history", urlController.getHistory);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search URLs
 *     tags: [URLs]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           example: example
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", urlController.searchUrls);

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       404:
 *         description: URL not found
 */
router.get("/:shortCode", urlController.redirectToUrl);

/**
 * @swagger
 * /api/update/{id}:
 *   put:
 *     summary: Update a short URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullUrl:
 *                 type: string
 *                 example: https://new-example.com
 *     responses:
 *       200:
 *         description: URL updated successfully
 */
router.put("/update/:id", validateUrl, urlController.updateUrl);

/**
 * @swagger
 * /api/delete/{id}:
 *   delete:
 *     summary: Delete a URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: URL deleted successfully
 */
router.delete("/delete/:id", urlController.deleteUrl);

module.exports = router;
