<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { TagData } from "@/types/Tag";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "vuetify";
import DateSelectDialog from "../Dialog/DateSelectDialog.vue";

interface SelectOption {
  text: string;
  value: string;
  parent?: string;
}
const date = useDate();
const { t } = useI18n();

const walletStore = useWalletStore();
const { categoriesTree, tags } = storeToRefs(walletStore);

const valid = ref<boolean>(false);
const selectedCategory = ref<string>();
const selectedTags = ref<(string | SelectOption)[]>([]);
const amount = ref<number>();
const selectedDate = ref<Date>(new Date());
const isDateSelectionDialogOpen = ref<boolean>(false);
const requiredField = required();

const categoriesOptions = computed(() =>
  categoriesTree.value.reduce((acc, category) => {
    if (category.subCategories.length) {
      acc.push(
        ...category.subCategories.map((child) => ({
          parent: category.name,
          text: child.name,
          value: child._id,
        }))
      );
    } else {
      acc.push({
        text: category.name,
        value: category._id,
      });
    }

    return acc;
  }, [] as SelectOption[])
);

const tagsOptions = computed(() =>
  tags.value.map((tag) => ({
    text: tag.name,
    value: tag._id,
  }))
);

const formattedDate = computed(() =>
  date.format(selectedDate.value, "normalDateWithWeekday")
);

function previousDay() {
  selectedDate.value = date.addDays(selectedDate.value, -1) as Date;
}

function nextDay() {
  selectedDate.value = date.addDays(selectedDate.value, 1) as Date;
}

async function createExpense() {
  console.log(selectedCategory.value);

  const tagIds = await createNewTags(selectedTags.value);

  await walletStore.createExpense({
    categoryId: selectedCategory.value!,
    tagIds,
    amount: amount.value!,
    date: selectedDate.value,
  });

  amount.value = undefined;
}

async function createNewTags(
  selectedTags: (string | SelectOption)[]
): Promise<string[]> {
  const newTags = selectedTags.filter((tag) => typeof tag === "string");

  if (!newTags.length) {
    return mapTags(selectedTags as SelectOption[]);
  }

  await walletStore.createTags(
    newTags.map((tag) => ({ name: tag })) as TagData[]
  );

  return mapTags(
    selectedTags.map((tag) => {
      if (typeof tag === "string") {
        const createdTag = tags.value.find((t) => t.name === tag)!;

        return {
          text: createdTag.name,
          value: createdTag._id,
        };
      }
      return tag;
    })
  );
}

function mapTags(tags: SelectOption[]): string[] {
  return tags.map((tag) => tag.value);
}
</script>

<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="createExpense">
      <div :class="$style.dateSelect">
        <v-btn icon="mdi-menu-left" variant="text" @click="previousDay"></v-btn>
        <v-btn
          color="primary"
          width="160"
          @click="isDateSelectionDialogOpen = true"
        >
          {{ formattedDate }}
        </v-btn>
        <v-btn icon="mdi-menu-right" variant="text" @click="nextDay"></v-btn>
      </div>

      <v-autocomplete
        v-model="selectedCategory"
        :items="categoriesOptions"
        :label="t('category.category')"
        :rules="[requiredField]"
        item-title="text"
        item-value="value"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props" :title="''">
            <v-list-item-title>
              <template v-if="item.raw.parent">
                <span>{{ item.raw.parent }}</span> /
              </template>
              <span class="text-primary">{{ item.title }}</span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-autocomplete>

      <v-combobox
        v-model="selectedTags"
        :items="tagsOptions"
        :label="t('tag.tags')"
        :rules="[requiredField]"
        item-title="text"
        item-value="value"
        chips
        closable-chips
        multiple
        :class="$style.tagSelect"
      ></v-combobox>

      <v-text-field
        v-model="amount"
        :label="t('expense.amount')"
        type="number"
        :rules="[requiredField]"
        append-inner-icon="mdi-currency-uah"
      ></v-text-field>

      <v-divider></v-divider>
      <br />

      <v-btn
        :disabled="!valid"
        type="submit"
        variant="elevated"
        color="primary"
      >
        {{ t("ui.add") }}
      </v-btn>
    </v-form>
  </v-card-text>

  <DateSelectDialog
    v-model:is-open="isDateSelectionDialogOpen"
    v-model:date="selectedDate"
  />
</template>

<style lang="scss" module>
.dateSelect {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  align-items: center;
}

.tagSelect {
  :global(.v-chip__close) {
    background-color: transparent;
  }
}
</style>
