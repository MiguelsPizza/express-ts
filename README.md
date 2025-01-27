A decade ago, nodejs and express opened the doors for javascript developers to write isomorphic javascript code. unfortunatly Express is largly maintained and even though version 5 was just released, it has fallen far behind other modern options like hono and fastify to name a few. It's lacks in many place but the place it lacks most is typescipt support.

there are many projects that aim to bring end to end type saftey to express. TRPC is the most prominit one but there are others like typed express that aim to do this. the issue with all of these packages is that they reuqired major re-writes of your express app which is a nonstarter for large legacy projects that use express. and if you are starting a new project, there really isn't any point in using express.

This library aims to bring th modern typescript e2e type-safe Dev expirence to the express stack and this repo also provides an opinionated set up for Typesafe MERN stack apps. this readme is two parts.

1 The typed router express package and the example typesafe MERN app.

the typed router is insired by hono and aims to match the hono api as much as possible. I would recomend switching to hono if you have a legacty express app in typescript and the typed router is a great intermediary step.

otherwise the typed router is just a thin wrapper around express that provides type inference for params and return types. there are some caveaugts which i will cover in the caveout section.

We use the express type and if you are already using the express router, this lib will be a drop in replacement. we are also matching the genetics for router
so a router.get<path, query, body, return>('/path'...)

considering you probably have a large api if you are using this project. i recomned exp;oring the type from each of your routers and creating clients for them separatly. The type design required expesnisve inference since we are working within the constraints of the existing express types. also creating a dts file for the types is highly recomended.


Elevating the mern stack:

For better or worse, the mern stacks ease of use and lack of solid design opinions made it the most accesible stack for js devs to build full web applications. It goes without saying that scaling a MERN stack codebase, like scaling a raw javascript codebase, is extremely difficult. Typescript solves many of the codebase scalablilty of javasript but it's full power is lost on the MERN stack. mongoDB's lack of schema enforcment make types unreiable at best and dangerously misleading at worst.

That being said, mongooses types have come a long way and e2e typesaftey can be enfored via validators. THis helps example repo is how i would recomend structuring your MERN typescript app.
