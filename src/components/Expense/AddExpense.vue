<script setup lang="ts">
import { required } from "@/helpers/inputValidations";
import { useWalletStore } from "@/store/wallet";
import { Expense } from "@/types/Expense";
import { TagData } from "@/types/Tag";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDate } from "vuetify";
import DateSelectDialog from "../Base/DateSelectDialog.vue";

interface SelectOption {
  text: string;
  value: string;
  parent?: string;
}

interface AddExpenseProps {
  expense?: Expense;
  confirmButtonLabel?: string;
}

const emit = defineEmits(["update:expense"]);
const props = withDefaults(defineProps<AddExpenseProps>(), {
  confirmButtonLabel: "ui.add",
});
const date = useDate();
const { t } = useI18n();
const walletStore = useWalletStore();

const { categoriesTree, tags } = storeToRefs(walletStore);
const valid = ref<boolean>(false);
const selectedCategory = ref<string>("");
const selectedTags = ref<(string | SelectOption)[]>([]);
const amount = ref<number | undefined>();
const selectedDate = ref<Date>(new Date());
const isDateSelectionDialogOpen = ref<boolean>(false);

if (props.expense) {
  amount.value = props.expense.amount;
  selectedCategory.value = props.expense.categoryId;
  selectedTags.value = props.expense.tagIds.map((tagId) => {
    const tag = tags.value.find((t) => t._id === tagId)!;

    return {
      text: tag.name,
      value: tag._id,
    };
  });
  selectedDate.value = new Date(props.expense.date);
}

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
  const { tags, success } = await formatTags(selectedTags.value);

  if (!success) {
    return;
  }

  if (props.expense) {
    await walletStore.updateExpense(
      {
        categoryId: selectedCategory.value!,
        tagIds: tags,
        amount: amount.value!,
        date: selectedDate.value,
      },
      props.expense._id
    );

    emit("update:expense");

    return;
  }

  await walletStore.createExpense({
    categoryId: selectedCategory.value!,
    tagIds: tags,
    amount: amount.value!,
    date: selectedDate.value,
  });

  amount.value = undefined;
  selectedTags.value = [];
}

async function formatTags(
  selectedTags: (string | SelectOption)[]
): Promise<{ success: boolean; tags: string[] }> {
  const newTags = selectedTags.filter((tag) => typeof tag === "string");

  if (!newTags.length) {
    return {
      success: true,
      tags: mapTags(selectedTags as SelectOption[]),
    };
  }

  const createdTags = await walletStore.createTags(
    newTags.map((tag) => ({ name: tag })) as TagData[]
  );

  if (!createdTags) {
    return {
      success: false,
      tags: [],
    };
  }

  return {
    success: true,
    tags: mapTags(
      selectedTags.map((tag) => {
        if (typeof tag === "string") {
          const createdTag = createdTags.find((t) => t.name === tag)!;

          return {
            text: createdTag.name,
            value: createdTag._id,
          };
        }

        return tag;
      })
    ),
  };
}

function mapTags(tags: SelectOption[]): string[] {
  return tags.map((tag) => tag.value);
}

interface InternalItem<T = any> {
  value: any;
  raw: T;
}

function filterResults(
  itemText: string,
  query: string,
  item?: InternalItem<SelectOption>
) {
  if (!item) {
    return false;
  }

  const hasParent =
    item.raw.parent &&
    item.raw.parent.toLowerCase().includes(query.toLowerCase());
  const hasText = itemText.toLowerCase().includes(query.toLowerCase());

  return hasParent || hasText;
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
        :custom-filter="filterResults"
        item-title="text"
        item-value="value"
        clearable
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

      <div :class="$style.actions">
        <v-btn
          :disabled="!valid"
          type="submit"
          variant="elevated"
          color="primary"
        >
          {{ t(props.confirmButtonLabel) }}
        </v-btn>

        <slot name="actions" />
      </div>
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

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
