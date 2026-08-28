-- =========================================================================
-- CREACIÓN DE BASE DE DATOS
-- =========================================================================
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'PromocionesDB')
BEGIN
    CREATE DATABASE [PromocionesDB];
END
GO

USE [PromocionesDB];
GO

-- =========================================================================
-- TABLAS PRINCIPALES
-- =========================================================================

-- Tabla: categorias
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'categorias')
BEGIN
    CREATE TABLE [dbo].[categorias](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [nombre] [varchar](100) NOT NULL,
        [descripcion] [nvarchar](max) NULL,
        [activo] [bit] NOT NULL CONSTRAINT [DF_categorias_activo] DEFAULT (1),
        CONSTRAINT [PK_categorias] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_categorias_nombre] UNIQUE NONCLUSTERED ([nombre] ASC)
    );
END
GO

-- Tabla: tipo_descuento (se amplió la columna descripcion a 100 caracteres)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'tipo_descuento')
BEGIN
    CREATE TABLE [dbo].[tipo_descuento](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [nombre] [varchar](50) NOT NULL,
        [descripcion] [varchar](100) NULL,
        [activo] [bit] NOT NULL CONSTRAINT [DF_tipo_descuento_activo] DEFAULT (1),
        CONSTRAINT [PK_tipo_descuento] PRIMARY KEY CLUSTERED ([id] ASC)
    );
END
GO

-- Tabla: estados_promocion
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'estados_promocion')
BEGIN
    CREATE TABLE [dbo].[estados_promocion](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [nombre] [varchar](50) NOT NULL,
        [descripcion] [varchar](100) NULL,
        [activo] [bit] NOT NULL CONSTRAINT [DF_estados_promocion_activo] DEFAULT (1),
        CONSTRAINT [PK_estados_promocion] PRIMARY KEY CLUSTERED ([id] ASC)
    );
END
GO

-- Tabla: productos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'productos')
BEGIN
    CREATE TABLE [dbo].[productos](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [codigo_barras] [varchar](50) NOT NULL,
        [nombre] [varchar](150) NOT NULL,
        [descripcion] [nvarchar](max) NULL,
        [precio_venta] [decimal](18, 2) NOT NULL,
        [precio_costo] [decimal](18, 2) NOT NULL,
        [stock_actual] [decimal](18, 3) NOT NULL,
        [categoria_id] [int] NOT NULL,
        [activo] [bit] NOT NULL CONSTRAINT [DF_productos_activo] DEFAULT (1),
        CONSTRAINT [PK_productos] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_productos_codigo_barras] UNIQUE NONCLUSTERED ([codigo_barras] ASC),
        CONSTRAINT [FK_productos_categorias] FOREIGN KEY ([categoria_id]) REFERENCES [dbo].[categorias] ([id])
    );
END
GO

-- Tabla: promociones
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'promociones')
BEGIN
    CREATE TABLE [dbo].[promociones](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [nombre] [varchar](150) NOT NULL,
        [descripcion] [nvarchar](max) NULL,
        [tipo_descuento_id] [int] NOT NULL,
        [valor_descuento] [decimal](18, 2) NULL,
        [cantidad_minima] [int] NULL,
        [cantidad_pagada] [int] NULL,
        [fecha_inicio] [datetime2](0) NOT NULL,
        [fecha_fin] [datetime2](0) NOT NULL,
        [activa] [bit] NOT NULL CONSTRAINT [DF_promociones_activa] DEFAULT (0),
        [estado_promocion_id] [int] NOT NULL,
        CONSTRAINT [PK_promociones] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_promociones_tipo_descuento] FOREIGN KEY ([tipo_descuento_id]) REFERENCES [dbo].[tipo_descuento] ([id]),
        CONSTRAINT [FK_promociones_estados_promocion] FOREIGN KEY ([estado_promocion_id]) REFERENCES [dbo].[estados_promocion] ([id])
    );
END
GO

-- Tabla: promocion_categorias
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'promocion_categorias')
BEGIN
    CREATE TABLE [dbo].[promocion_categorias](
        [promocion_id] [int] NOT NULL,
        [categoria_id] [int] NOT NULL,
        CONSTRAINT [PK_promocion_categorias] PRIMARY KEY CLUSTERED ([promocion_id] ASC, [categoria_id] ASC),
        CONSTRAINT [FK_promocion_categorias_promocion] FOREIGN KEY ([promocion_id]) REFERENCES [dbo].[promociones] ([id]) ON DELETE CASCADE,
        CONSTRAINT [FK_promocion_categorias_categoria] FOREIGN KEY ([categoria_id]) REFERENCES [dbo].[categorias] ([id])
    );
END
GO

-- Tabla: promocion_productos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'promocion_productos')
BEGIN
    CREATE TABLE [dbo].[promocion_productos](
        [promocion_id] [int] NOT NULL,
        [producto_id] [int] NOT NULL,
        CONSTRAINT [PK_promocion_productos] PRIMARY KEY CLUSTERED ([promocion_id] ASC, [producto_id] ASC),
        CONSTRAINT [FK_promocion_productos_promocion] FOREIGN KEY ([promocion_id]) REFERENCES [dbo].[promociones] ([id]) ON DELETE CASCADE,
        CONSTRAINT [FK_promocion_productos_producto] FOREIGN KEY ([producto_id]) REFERENCES [dbo].[productos] ([id])
    );
END
GO

-- Tabla: promocion_reglas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'promocion_reglas')
BEGIN
    CREATE TABLE [dbo].[promocion_reglas](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [promocion_id] [int] NOT NULL,
        [dias_semana] [varchar](20) NULL,
        [hora_inicio] [time](0) NULL,
        [hora_fin] [time](0) NULL,
        [limite_usos_por_ticket] [int] NULL,
        CONSTRAINT [PK_promocion_reglas] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_promocion_reglas_promocion] FOREIGN KEY ([promocion_id]) REFERENCES [dbo].[promociones] ([id]) ON DELETE CASCADE
    );
END
GO

-- Tabla: ventas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'ventas')
BEGIN
    CREATE TABLE [dbo].[ventas](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [fecha_venta] [datetime2](0) NOT NULL,
        [subtotal] [decimal](18, 2) NOT NULL,
        [descuento_total] [decimal](18, 2) NOT NULL,
        [total] [decimal](18, 2) NOT NULL,
        CONSTRAINT [PK_ventas] PRIMARY KEY CLUSTERED ([id] ASC)
    );
END
GO

-- Tabla: detalle_ventas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'detalle_ventas')
BEGIN
    CREATE TABLE [dbo].[detalle_ventas](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [venta_id] [int] NOT NULL,
        [producto_id] [int] NOT NULL,
        [cantidad] [decimal](18, 3) NOT NULL,
        [precio_regular] [decimal](18, 2) NOT NULL,
        [promocion_id] [int] NULL,
        [descuento_aplicado] [decimal](18, 2) NOT NULL,
        [precio_final] [decimal](18, 2) NOT NULL,
        CONSTRAINT [PK_detalle_ventas] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_detalle_ventas_venta] FOREIGN KEY ([venta_id]) REFERENCES [dbo].[ventas] ([id]),
        CONSTRAINT [FK_detalle_ventas_producto] FOREIGN KEY ([producto_id]) REFERENCES [dbo].[productos] ([id]),
        CONSTRAINT [FK_detalle_ventas_promocion] FOREIGN KEY ([promocion_id]) REFERENCES [dbo].[promociones] ([id])
    );
END
GO

-- =========================================================================
-- SEED DATA INICIAL
-- =========================================================================

-- Tipos de Descuento
IF NOT EXISTS (SELECT 1 FROM [dbo].[tipo_descuento] WHERE [id] = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[tipo_descuento] ON;
    INSERT INTO [dbo].[tipo_descuento] ([id], [nombre], [descripcion], [activo]) VALUES (1, 'Porcentaje', 'Descuento %', 1);
    SET IDENTITY_INSERT [dbo].[tipo_descuento] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[tipo_descuento] WHERE [id] = 2)
BEGIN
    SET IDENTITY_INSERT [dbo].[tipo_descuento] ON;
    INSERT INTO [dbo].[tipo_descuento] ([id], [nombre], [descripcion], [activo]) VALUES (2, 'Monto Fijo', 'Descuento valor fijo', 1);
    SET IDENTITY_INSERT [dbo].[tipo_descuento] OFF;
END
GO

-- Estados de Promoción
IF NOT EXISTS (SELECT 1 FROM [dbo].[estados_promocion] WHERE [id] = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[estados_promocion] ON;
    INSERT INTO [dbo].[estados_promocion] ([id], [nombre], [descripcion], [activo]) VALUES (1, 'Programada', 'Promoción aún no vigente', 1);
    SET IDENTITY_INSERT [dbo].[estados_promocion] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[estados_promocion] WHERE [id] = 2)
BEGIN
    SET IDENTITY_INSERT [dbo].[estados_promocion] ON;
    INSERT INTO [dbo].[estados_promocion] ([id], [nombre], [descripcion], [activo]) VALUES (2, 'Activa', 'Promoción vigente y aplicable', 1);
    SET IDENTITY_INSERT [dbo].[estados_promocion] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[estados_promocion] WHERE [id] = 3)
BEGIN
    SET IDENTITY_INSERT [dbo].[estados_promocion] ON;
    INSERT INTO [dbo].[estados_promocion] ([id], [nombre], [descripcion], [activo]) VALUES (3, 'Finalizada', 'Promoción culminada', 1);
    SET IDENTITY_INSERT [dbo].[estados_promocion] OFF;
END
GO

-- Categorías
IF NOT EXISTS (SELECT 1 FROM [dbo].[categorias] WHERE [id] = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[categorias] ON;
    INSERT INTO [dbo].[categorias] ([id], [nombre], [descripcion], [activo]) VALUES (1, 'Bebidas', 'Bebidas frías, jugos y refrescos', 1);
    SET IDENTITY_INSERT [dbo].[categorias] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[categorias] WHERE [id] = 2)
BEGIN
    SET IDENTITY_INSERT [dbo].[categorias] ON;
    INSERT INTO [dbo].[categorias] ([id], [nombre], [descripcion], [activo]) VALUES (2, 'Snacks y Galletas', 'Papas fritas, galletas y pasabocas', 1);
    SET IDENTITY_INSERT [dbo].[categorias] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[categorias] WHERE [id] = 3)
BEGIN
    SET IDENTITY_INSERT [dbo].[categorias] ON;
    INSERT INTO [dbo].[categorias] ([id], [nombre], [descripcion], [activo]) VALUES (3, 'Lácteos', 'Leches, yogures y quesos', 1);
    SET IDENTITY_INSERT [dbo].[categorias] OFF;
END
GO

-- Productos
IF NOT EXISTS (SELECT 1 FROM [dbo].[productos] WHERE [id] = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[productos] ON;
    INSERT INTO [dbo].[productos] ([id], [codigo_barras], [nombre], [descripcion], [precio_venta], [precio_costo], [stock_actual], [categoria_id], [activo])
    VALUES (1, '770100100001', 'Gaseosa Cola 1.5L', 'Bebida carbonatada 1.5L', 5000.00, 3200.00, 150.000, 1, 1);
    SET IDENTITY_INSERT [dbo].[productos] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[productos] WHERE [id] = 2)
BEGIN
    SET IDENTITY_INSERT [dbo].[productos] ON;
    INSERT INTO [dbo].[productos] ([id], [codigo_barras], [nombre], [descripcion], [precio_venta], [precio_costo], [stock_actual], [categoria_id], [activo])
    VALUES (2, '770100100002', 'Agua Mineral 600ml', 'Agua mineral sin gas', 2500.00, 1200.00, 300.000, 1, 1);
    SET IDENTITY_INSERT [dbo].[productos] OFF;
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[productos] WHERE [id] = 3)
BEGIN
    SET IDENTITY_INSERT [dbo].[productos] ON;
    INSERT INTO [dbo].[productos] ([id], [codigo_barras], [nombre], [descripcion], [precio_venta], [precio_costo], [stock_actual], [categoria_id], [activo])
    VALUES (3, '770100100003', 'Papas Fritas Tradicionales 115g', 'Papas fritas con sal', 4500.00, 2800.00, 80.000, 2, 1);
    SET IDENTITY_INSERT [dbo].[productos] OFF;
END
GO