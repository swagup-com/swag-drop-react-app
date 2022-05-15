const statusCode = codes => ({
  validateStatus: status => (Array.isArray(codes) ? codes.includes(status) : codes === status)
});

export const status200 = statusCode(200);
export const status201 = statusCode(201);
export const status204 = statusCode(204);
export const status200or201 = statusCode([200, 201]);
