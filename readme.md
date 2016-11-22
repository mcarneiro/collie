# Collie - base box modelling to create columns layouts

`version 0.1.0-rc`

Sometimes you don't need a gridsystem framework to use columns layout.

Collie is a mixin for stylus that will give you the base box modelling for this. It let you choose the box modelling technique (`float`, `inline-block` or `table`), the gutter value and the amount of columns.

It was born from the need of projects with multiple grids defined or no grid at all. Instead of creating a main amount of columns, gutter value, etc. You just use it as it is needed.

## Install

1. Install collie: `npm install mcarneiro/collie#db8892ac --save`;
2. Add it into your file `@require "node_modules/collie/src/collie";`;
3. Call the mixin `collie()`;

## collie()

All parameters are optional. By default it'll create a `float` technique, 2 column with 10px gutter module:

```
.my-holder {
    collie();
}
```

will output to:

```
.my-holder {
  margin-left: -10px;
}
.my-holder:after {
  clear: both;
  content: "";
  display: table;
}
.my-holder > .col {
  margin-left: 10px;
  width: calc(50% - 10px);
  float: left;
}
```

Your HTML can be:

```
<div class="my-holder">
  <div class="col my-module"> ... </div>
  <div class="col my-module"> ... </div>
</div>
```

You can place the amount of columns:

```
.my-holder {
    collie(4);
}
```

and it'll output the width as `calc(25% - 10px)`.

Just set the `$gutter` parameter to change the gutter:

```
.my-holder {
    collie(4, $gutter: 20px);
}
```

Changes in the output will be:

```
.my-holder {
  margin-left: -20px;
}
.my-holder:after {
  clear: both;
  content: "";
  display: table;
}
.my-holder > .col {
  margin-left: 20px;
  width: calc(50% - 20px);
  float: left;
}
```

Set `$type` to change the box modelling technique:

```
.my-holder {
    collie(4, $type: "inline-block");
}
```

and it'll output:

```
.my-holder {
  margin-left: -10px;
  font-size: 0;
  margin-top: -10px;
}
.my-holder > .col {
  margin-left: 10px;
  width: calc(25% - 10px);
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  vertical-align: top;
}
```

Notice that it uses the `font-size: 0` technique to avoid space between the elements. You can set the value of font-size with parameter `$ib-font-size`. Ex.: `collie(4, $type: "inline-block", $ib-font-size: 12px);`.

It also will use gutter to apply to the `margin-top`, as inline-block is usually used for lists with multiple lines.

To use `table` technique, `.col` will need to be a wrapper and you'll need to add a `.row-w` element. Ex.:

```
.my-holder {
   collie($type: "table"); 
}
```

It'll output:

```
.my-holder {
  margin-left: -10px;
}
.my-holder > .row-w {
  display: table;
  width: 100%;
}
.my-holder > .row-w > .col {
  display: table-cell;
  padding-left: 10px;
  width: 50%;
}
```

Your HTML will need to be:

```
<div class="my-holder">
  <div class="row-w">
    <div class="col">
      <div class="my-holder">...</div>
    </div>
    <div class="col">
      <div class="my-holder">...</div>
    </div>
  </div>
</div>
```

Responsive behaviour is up to you. Collie will output the basics and you can override anything you want. You can use `collie("reset");` to reset, in case you are using `max-width` or you can use collie only to `min-width`.

Max-width technique:

```
.my-holder {
  collie();

  @media (max-width: 650px) {
    collie("reset");
  }
}
```

It'll output:

```
.my-holder {
  margin-left: -10px;
}
.my-holder:after {
  clear: both;
  content: "";
  display: table;
}
.my-holder > .col {
  box-sizing: border-box;
  margin-left: 10px;
  width: calc(50% - 10px);
  float: left;
}
@media (max-width: 650px) {
  .my-holder {
    margin-top: 0;
  }
  .my-holder > .col {
    margin-top: 10px;
    display: block;
    float: none;
    width: auto;
  }
  .my-holder > .col:first-child {
    margin-top: 0;
  }
}
```

Min-width technique:

```
.my-holder {
  @media (max-width: 650px) {
    > .col {
      margin-top: 10px;
      
      &:first-child {
        margin-top: 0;
      }
    }
  }
  @media (min-width: 651px) {
    collie();
  }
}
```

Will output to:

```
@media (max-width: 650px) {
  .my-holder > .col {
    margin-top: 10px;
  }
  .my-holder > .col:first-child {
    margin-top: 0;
  }
}
@media (min-width: 651px) {
  .my-holder {
    margin-left: -10px;
  }
  .my-holder:after {
    clear: both;
    content: "";
    display: table;
  }
  .my-holder > .col {
    box-sizing: border-box;
    margin-left: 10px;
    width: calc(50% - 10px);
    float: left;
  }
}
```

## collie-width()

This function is only a wrapper to create the `calc` call. It'll make your life easier when you want to change the size of a column:

```
.my-holder {
  collie(4);

  > .col:first-child {
    width: collie-width(percentage(3/4));
  }
}
```

The `first-child` of column will output:

```
.my-holder > .col:first-child {
  width: calc(75% - 10px);
}
```

You can set the gutter using the second parameter: `collie-width(50%, 20px)`.

## TODO

* Create git pages with example;
* Try to find a way to re-use the gutter on next calls;
* SASS version;
* Publish "legacy" (ie8+) version;

## How to contribute

Every help is welcomed, you can test and open issues or create pull request.

Clone the project and:

* Run `npm install` and `npm run watch:example` to compile example/test files;
* Follow the present code style;
* Keep it lint free;
* Update the docs and example pages with relevant information;
