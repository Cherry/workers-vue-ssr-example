<template>
	<hello-world></hello-world>
	<another-component></another-component>
</template>


<script>
import helloWorld from './hello-world.vue';
import anotherComponent from './another-component.vue';
export default {
	name: 'app',
	components: {
		helloWorld,
		anotherComponent,
	},
};
</script>