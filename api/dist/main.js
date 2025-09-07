"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_fastify_1 = require("@nestjs/platform-fastify");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const configService = app.get(config_1.ConfigService);
    const PORT = configService.get('PORT') ?? 3000;
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder().
        setTitle('API Restful NestJS')
        .setDescription('API Restful com NestJS do zero ao deploy com docker, terraform e aws')
        .setVersion('1.0')
        .addTag('users')
        .build();
    const swaggerCDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.7.2';
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'API Restful NestJS',
        customJs: [
            `${swaggerCDN}/swagger-ui-bundle.js`,
            `${swaggerCDN}/swagger-ui-standalone-preset.js`,
        ]
    });
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger is running on port ${PORT}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map